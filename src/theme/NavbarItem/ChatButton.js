import React from 'react';
import Link from '@docusaurus/Link';

// 导航栏绿色聊天入口按钮——与 FORUM 风格一致
export default function ChatButton() {
  return (
    <Link
      to="/chat"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 16px',
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        color: '#fff',
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
        textDecoration: 'none',
        boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(34, 197, 94, 0.3)';
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span>在线聊天室</span>
    </Link>
  );
}
