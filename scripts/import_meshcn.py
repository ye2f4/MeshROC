#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
将 meshcn_mirror 中的 Hexo 文章 (HTML) 转换为 MeshROC 站点的 Docusaurus 博客文章 (Markdown)。

- 提取 <div class="post__content"> 内的正文
- 转为 Markdown（标题/列表/引用/代码/表格/图片/链接）
- 内部相对链接/图片重写到 https://meshcn.net/...
- 顶部加 MeshCN 转载署名，front matter 写入标题/日期/标签/slug
- 对 { } < 做 MDX 安全转义（代码块内不转义）
"""
import os
import re
import html
from html.parser import HTMLParser

SRC = r"C:\Users\Administrator\CodeBuddy\Claw\meshcn_mirror"
DST = r"e:\meshroc\blog"
BASE = "https://meshcn.net"

# 结构性页面目录，跳过
SKIP_DIRS = {"archives", "categories", "tags", "page", "search", "contact", "images", "press-resource"}

# 分类中文 -> 英文标签（避免 CJK slug 问题）
CATEGORY_MAP = {
    "资讯": "News",
    "教程": "Tutorial",
    "评测": "Review",
    "公告": "Announcement",
    "硬件": "Hardware",
    "软件": "Software",
    "设备": "Device",
    "杂谈": "Misc",
    "其他": "Misc",
}

SKIP_TAGS = {"script", "style", "iframe", "video", "picture", "svg", "noscript"}


def yaml_str(s):
    s = (s or "").replace("\\", "\\\\").replace('"', '\\"')
    return '"' + s + '"'


def sanitize_tag(t):
    t = (t or "").strip()
    if not t:
        return None
    # 仅保留 ASCII 标签，中文标签直接丢弃（避免 CJK slug 报错）
    if not re.match(r"^[\x00-\x7F]+$", t):
        return None
    t = re.sub(r"\s+", "-", t)
    t = re.sub(r"[^A-Za-z0-9\-_]", "", t)
    return t or None


# ---------------------------------------------------------------------------
# 元数据提取
# ---------------------------------------------------------------------------
def get_meta(raw):
    meta = {}
    m = re.search(r'<meta property="og:title" content="([^"]*)"', raw)
    if m:
        title = m.group(1)
    else:
        m = re.search(r"<title>([^<]*)</title>", raw)
        title = m.group(1) if m else "无标题"
        title = re.sub(r"\s*\|\s*MeshCN.*$", "", title)
    meta["title"] = html.unescape(title).strip()

    date = None
    m = re.search(r'<meta property="article:published_time" content="([^"]*)"', raw)
    if m:
        date = m.group(1)[:10]
    if not date:
        m = re.search(r'<meta property="article:modified_time" content="([^"]*)"', raw)
        if m:
            date = m.group(1)[:10]
    meta["date"] = date or "2024-01-01"

    m = re.search(r'<meta property="article:section" content="([^"]*)"', raw)
    meta["category"] = html.unescape(m.group(1)) if m else ""

    meta["tags"] = [html.unescape(t) for t in re.findall(r'<meta property="article:tag" content="([^"]*)"', raw)]

    m = re.search(r'<link rel="canonical" href="([^"]*)"', raw)
    meta["canonical"] = m.group(1) if m else ""

    m = re.search(r'<meta name="description" content="([^"]*)"', raw)
    if not m:
        m = re.search(r'<meta property="og:description" content="([^"]*)"', raw)
    meta["description"] = html.unescape(m.group(1)) if m else ""

    return meta


# ---------------------------------------------------------------------------
# HTML -> Markdown 转换器
# ---------------------------------------------------------------------------
class ArticleParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.blocks = []
        self.cur = []
        self.active = False
        self.stack = []
        self.content_base = None
        self.in_pre = False
        self.pre_lines = []
        self.in_blockquote = False
        self.list_stack = []
        self.ol_count = []
        self.in_link = False
        self.link_href = None
        self.link_text = []
        self.in_code_inline = False
        self.code_buf = []
        self.skip = False
        self.skip_base = None
        self.heading = None
        self.heading_emph = 0
        self.page_base = None
        self.in_table = False
        self.table_rows = []
        self.table_row = []
        self.in_cell = False
        self.cell_is_th = False
        self.cell_buf = []

    # ---- helpers ----
    def flush_para(self):
        text = "".join(self.cur).strip()
        if not text:
            self.cur = []
            return
        if self.in_blockquote:
            for ln in text.split("\n"):
                self.blocks.append("> " + ln)
        else:
            self.blocks.append(text)
        self.cur = []

    def emit_heading(self):
        if self.heading:
            lvl, buf = self.heading
            t = re.sub(r"\s+", " ", "".join(buf)).strip()
            if t:
                self.blocks.append(f"{lvl} {t}")
            self.heading = None

    def _sink(self):
        # 当前文本应当写入的位置：标题内 -> 标题缓冲，否则 -> 段落缓冲
        return self.heading[1] if self.heading is not None else self.cur

    def emit_table(self):
        rows = [["".join(c).strip() for c in r] for r in self.table_rows]
        if not rows:
            return
        maxc = max(len(r) for r in rows)
        for r in rows:
            while len(r) < maxc:
                r.append("")
        out = []
        out.append("| " + " | ".join(rows[0]) + " |")
        out.append("| " + " | ".join(["---"] * maxc) + " |")
        for r in rows[1:]:
            out.append("| " + " | ".join(r) + " |")
        self.blocks.append("\n".join(out))

    def fix_url(self, u):
        if not u:
            return u
        if u.startswith("http://") or u.startswith("https://") or u.startswith("//"):
            return u
        if u.startswith("#"):
            return u
        base = (self.page_base.rstrip("/") + "/") if self.page_base else (BASE + "/")
        if u.startswith("../"):
            return BASE + "/" + u[3:].lstrip("/")
        if u.startswith("./"):
            return base + u[2:]
        if u.startswith("/"):
            return BASE + u
        # 裸相对路径（无 ./ 前缀）：按文章所在目录解析
        return base + u

    # ---- parsing ----
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        cls = d.get("class", "")
        # 栈维护（始终）
        self.stack.append(tag)

        if not self.active:
            if tag == "div" and "post__content" in cls.split():
                self.active = True
                self.content_base = len(self.stack) - 1
            return

        if self.skip:
            return
        if tag in SKIP_TAGS:
            self.skip = True
            self.skip_base = len(self.stack) - 1
            return

        # 表格处理
        if tag == "table":
            self.in_table = True
            self.table_rows = []
            self.table_row = []
            self.in_cell = False
            self.cell_buf = []
            return
        if self.in_table:
            if tag in ("thead", "tbody", "colgroup", "caption"):
                return
            if tag == "tr":
                self.table_row = []
                return
            if tag in ("td", "th"):
                self.in_cell = True
                self.cell_is_th = tag == "th"
                self.cell_buf = []
                return
            return

        # 块级标签
        if tag in ("p", "div", "section", "figure", "figcaption"):
            self.flush_para()
        elif tag == "br":
            self.cur.append("  \n")
        elif tag == "hr":
            self.flush_para()
            self.blocks.append("---")
        elif tag == "h1":
            self.flush_para()
            self.emit_heading()
            # 跳过 h1（避免与 front matter 标题重复）
        elif tag == "h2":
            self.flush_para()
            self.emit_heading()
            self.heading = ("##", [])
        elif tag == "h3":
            self.flush_para()
            self.emit_heading()
            self.heading = ("###", [])
        elif tag == "h4":
            self.flush_para()
            self.emit_heading()
            self.heading = ("####", [])
        elif tag == "h5":
            self.flush_para()
            self.emit_heading()
            self.heading = ("#####", [])
        elif tag == "ul":
            self.flush_para()
            self.list_stack.append("ul")
        elif tag == "ol":
            self.flush_para()
            self.list_stack.append("ol")
            self.ol_count.append(1)
        elif tag == "li":
            self.flush_para()
            depth = len(self.list_stack)
            indent = "  " * (depth - 1)
            if self.list_stack[-1] == "ol":
                marker = f"{self.ol_count[-1]}. "
                self.ol_count[-1] += 1
            else:
                marker = "- "
            self.cur.append(indent + marker)
        elif tag == "blockquote":
            self.flush_para()
            self.in_blockquote = True
        elif tag == "pre":
            self.flush_para()
            self.in_pre = True
            self.pre_lines = []
        elif tag == "code":
            if not self.in_pre:
                self.in_code_inline = True
                self.code_buf = []
        elif tag == "a":
            self.in_link = True
            self.link_href = d.get("href", "")
            self.link_text = []
        elif tag in ("strong", "b"):
            if self.heading is not None:
                self.heading_emph += 1
            else:
                self._sink().append("**")
        elif tag in ("em", "i"):
            if self.heading is not None:
                self.heading_emph += 1
            else:
                self._sink().append("*")
        elif tag == "img":
            src = self.fix_url(d.get("src", ""))
            alt = d.get("alt", "") or ""
            self._sink().append(f"![{alt}]({src})")
        elif tag in ("span", "sub", "sup", "small", "label"):
            pass

    def handle_endtag(self, tag):
        if self.stack and self.stack[-1] == tag:
            self.stack.pop()
        elif tag in self.stack:
            while self.stack and self.stack[-1] != tag:
                self.stack.pop()
            if self.stack:
                self.stack.pop()

        if not self.active:
            return

        if self.skip:
            if len(self.stack) <= self.skip_base:
                self.skip = False
                self.skip_base = None
            return

        if self.in_table:
            if tag in ("td", "th"):
                self.table_row.append("".join(self.cell_buf).strip())
                self.in_cell = False
                self.cell_buf = []
                return
            if tag == "tr":
                self.table_rows.append(self.table_row)
                self.table_row = []
                return
            if tag == "table":
                self.emit_table()
                self.in_table = False
                return
            return

        if tag in ("p", "div", "section", "figure", "figcaption"):
            self.flush_para()
        elif tag in ("h1", "h2", "h3", "h4", "h5"):
            self.emit_heading()
        elif tag == "ul":
            self.flush_para()
            if self.list_stack:
                self.list_stack.pop()
        elif tag == "ol":
            self.flush_para()
            if self.list_stack:
                self.list_stack.pop()
            if self.ol_count:
                self.ol_count.pop()
        elif tag == "li":
            self.flush_para()
        elif tag == "blockquote":
            self.flush_para()
            self.in_blockquote = False
        elif tag == "pre":
            code = "\n".join(self.pre_lines).rstrip()
            self.blocks.append("```\n" + code + "\n```")
            self.in_pre = False
        elif tag == "code":
            if self.in_code_inline:
                self._sink().append("`" + "".join(self.code_buf).strip() + "`")
                self.in_code_inline = False
                self.code_buf = []
        elif tag == "a":
            if self.in_link:
                if self.heading is not None:
                    pass  # 标题内的链接：仅保留文本，已写入标题缓冲
                else:
                    txt = "".join(self.link_text).strip()
                    href = self.fix_url(self.link_href)
                    self.cur.append(f"[{txt}]({href})")
                self.in_link = False
                self.link_text = []
        elif tag in ("strong", "b"):
            if self.heading_emph > 0:
                self.heading_emph -= 1
            else:
                self._sink().append("**")
        elif tag in ("em", "i"):
            if self.heading_emph > 0:
                self.heading_emph -= 1
            else:
                self._sink().append("*")

        # 离开正文 div 时停用
        if tag == "div" and self.active and self.content_base is not None and len(self.stack) <= self.content_base:
            self.active = False

    def handle_data(self, data):
        if not self.active or self.skip:
            return
        if self.in_table:
            if self.in_cell:
                self.cell_buf.append(data)
            return
        if self.in_pre:
            self.pre_lines.append(data)
            return
        if self.in_code_inline:
            self.code_buf.append(data)
            return
        if self.in_link:
            if self.heading is not None:
                self.heading[1].append(data)
            else:
                self.link_text.append(data)
            return
        if self.heading is not None:
            self.heading[1].append(data)
            return
        self.cur.append(data)


def escape_mdx(text):
    out = []
    infence = False
    for line in text.split("\n"):
        if line.strip().startswith("```"):
            infence = not infence
            out.append(line)
            continue
        if not infence:
            line = line.replace("{", "\\{").replace("}", "\\}").replace("<", "&lt;")
        out.append(line)
    return "\n".join(out)


def process(slug):
    path = os.path.join(SRC, slug, "index.html")
    if not os.path.exists(path):
        return None
    html = open(path, encoding="utf-8", errors="replace").read()
    meta = get_meta(html)
    canon = meta["canonical"] or (BASE + "/" + slug + "/")
    p = ArticleParser()
    p.page_base = canon
    p.feed(html)
    p.flush_para()
    p.emit_heading()
    body = "\n\n".join(b for b in p.blocks if b.strip())
    if not body.strip():
        return None  # 非文章（结构页）

    attr = f"> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：{canon}\n"

    tags = []
    if meta["category"]:
        mapped = CATEGORY_MAP.get(meta["category"].strip())
        if mapped:
            tags.append(mapped)
    for t in meta["tags"]:
        st = sanitize_tag(t)
        if st:
            tags.append(st)
    seen = set()
    tags = [t for t in tags if not (t in seen or seen.add(t))][:4]

    fm = "---\n"
    fm += f'title: {yaml_str(meta["title"])}\n'
    fm += f'date: {yaml_str(meta["date"])}\n'
    if meta["description"]:
        fm += f'description: {yaml_str(meta["description"])}\n'
    if tags:
        fm += "tags:\n" + "\n".join(f"  - {yaml_str(t)}" for t in tags) + "\n"
    fm += f'slug: {yaml_str(slug)}\n'
    fm += "---\n\n"

    content = fm + attr + "\n" + escape_mdx(body) + "\n"
    return content


def main():
    os.makedirs(DST, exist_ok=True)
    ok = 0
    skipped = 0
    errors = []
    for name in sorted(os.listdir(SRC)):
        sdir = os.path.join(SRC, name)
        if not os.path.isdir(sdir):
            continue
        if name in SKIP_DIRS:
            continue
        if not os.path.exists(os.path.join(sdir, "index.html")):
            continue
        try:
            content = process(name)
        except Exception as e:
            errors.append(f"{name}: {e}")
            continue
        if content is None:
            skipped += 1
            continue
        out = os.path.join(DST, name + ".md")
        with open(out, "w", encoding="utf-8") as f:
            f.write(content)
        ok += 1

    print(f"OK: {ok}  Skipped(non-article): {skipped}  Errors: {len(errors)}")
    for e in errors:
        print("  ERR " + e)


if __name__ == "__main__":
    main()
