import React, { useState, useEffect } from 'react';
import CommentSection from '@site/src/components/CommentSection';
import { safeGetUser } from '@/lib/supabase/safe';

const siteData = {
  texts: {
    comments: {
      title: '💬 文章评论区',
      placeholder: '分享你的看法或技术见解…',
      submit: '发表评论',
      empty: '还没有评论，来抢个沙发吧～',
    },
  },
};

export default function DocCommentSection() {
  const [commentContent, setCommentContent] = useState('');
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  // 仅作默认头像兜底前缀；评论均带 emoji/url 头像，base 实际不会被用到
  const base = '/';

  useEffect(() => {
    setMounted(true);
    let active = true;
    (async () => {
      try {
        const { user: u } = await safeGetUser();
        if (active) setUser(u);
      } catch (e) {
        console.error('加载评论用户失败：', e);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <div style={{ marginTop: '2rem' }}>
      {mounted ? (
        <CommentSection
          commentContent={commentContent}
          setCommentContent={setCommentContent}
          commentLoading={false}
          user={user}
          base={base}
          siteData={siteData}
        />
      ) : (
        <div style={{ padding: 15, textAlign: 'center', color: 'var(--ifm-color-emphasis-500)', fontSize: 13 }}>
          评论加载中…
        </div>
      )}
    </div>
  );
}
