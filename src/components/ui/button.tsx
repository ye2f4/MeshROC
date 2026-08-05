import React from 'react';
import { cn } from '@site/src/lib/utils';

/**
 * 复用 meshtastic 的 Button 视觉与 API（variant / size / asChild）。
 * 本仓库未安装 class-variance-authority 与 @radix-ui/react-slot，
 * 因此用等价的原生实现，避免新增依赖。
 */

export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 no-underline hover:no-underline';

const variants: Record<ButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
  outline:
    'border border-border bg-background hover:bg-accent hover:text-accent-foreground',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
};

const sizes: Record<ButtonSize, string> = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
};

export function buttonVariants({
  variant = 'default',
  size = 'default',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** 为 true 时把样式合并到唯一子元素上（等价 Radix Slot） */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'default', size = 'default', asChild = false, ...props },
    ref
  ) => {
    const classes = buttonVariants({ variant, size, className });

    if (asChild) {
      const child = React.Children.only(props.children as React.ReactElement);
      return React.cloneElement(child, {
        ...props,
        children: child.props.children,
        className: cn(classes, child.props.className),
        ref,
      });
    }

    return <button ref={ref} className={classes} {...props} />;
  }
);

Button.displayName = 'Button';

export default Button;
