import React from 'react';
import Layout from '@theme/Layout';
import { cn } from '@site/src/lib/utils';

export interface PageLayoutProps {
  /** 浏览器标题 */
  title: string;
  /** SEO 描述 */
  description?: string;
  /** 页面主标题（不传则不渲染 hero） */
  heading?: React.ReactNode;
  /** 页面副标题 */
  subheading?: React.ReactNode;
  /** hero 上方的小徽章文案 */
  eyebrow?: React.ReactNode;
  /** hero 下方的行动按钮区 */
  actions?: React.ReactNode;
  /** 内容最大宽度容器，默认 max-w-7xl */
  containerClassName?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * 复用 meshtastic 的页面布局骨架：
 * Layout(官方 navbar/footer) → hero 区 → 居中内容容器。
 * 全部使用 Tailwind + hsl token（bg-background / text-foreground / border-border ...）。
 */
export default function PageLayout({
  title,
  description,
  heading,
  subheading,
  eyebrow,
  actions,
  containerClassName,
  className,
  children,
}: PageLayoutProps) {
  return (
    <Layout title={title} description={description}>
      <main className={cn('bg-background text-foreground', className)}>
        {heading ? (
          <section className="border-b border-border bg-muted/30">
            <div
              className={cn(
                'mx-auto w-full px-4 py-16 sm:px-6 lg:px-8 lg:py-20',
                containerClassName ?? 'max-w-7xl'
              )}
            >
              {eyebrow ? (
                <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-primary">
                  {eyebrow}
                </span>
              ) : null}

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {heading}
              </h1>

              {subheading ? (
                <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                  {subheading}
                </p>
              ) : null}

              {actions ? (
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {actions}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        <div
          className={cn(
            'mx-auto w-full px-4 py-12 sm:px-6 lg:px-8 lg:py-16',
            containerClassName ?? 'max-w-7xl'
          )}
        >
          {children}
        </div>
      </main>
    </Layout>
  );
}
