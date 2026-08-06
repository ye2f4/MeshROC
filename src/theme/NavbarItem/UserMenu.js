import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import { supabase, AVATAR_CACHE_KEY, AVATAR_CACHE_EXPIRE } from '@/supabase/supabaseClient';
import { safeGetUser } from '@/lib/supabase/safe';
import { storage } from '@/utils/storage';

// 导航栏用户头像/登录入口——显示在聊天按钮右侧
export default function UserMenu() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState('');
  const [nickname, setNickname] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    try {
      // 先读缓存
      const cache = storage.get(AVATAR_CACHE_KEY);
      if (cache && cache.userId === userId && Date.now() - cache.timestamp < AVATAR_CACHE_EXPIRE) {
        setAvatar(cache.avatar || '🙂');
        setNickname(cache.nickname || '');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url, nickname')
        .eq('id', userId)
        .single();

      if (error) throw error;

      const av = data?.avatar_url || '🙂';
      const nick = data?.nickname || '';
      setAvatar(av);
      setNickname(nick);

      // 更新缓存
      storage.set(AVATAR_CACHE_KEY, {
        userId,
        avatar: av,
        nickname: nick,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error('加载用户信息失败：', err);
    }
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const { user: u } = await safeGetUser();
        if (!mounted) return;
        setUser(u);
        if (u) {
          await fetchProfile(u.id);
        }
      } catch (err) {
        console.error('用户菜单初始化失败：', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();

    // 监听登录状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setAvatar('');
        setNickname('');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div style={{ width: 36, height: 36 }} />;
  }

  // 未登录：显示登录/注册按钮
  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link
          to="/login"
          style={{
            padding: '6px 14px',
            color: 'hsl(var(--foreground))',
            fontSize: 14,
            fontWeight: 500,
            textDecoration: 'none',
            borderRadius: 8,
            transition: 'background 0.2s',
          }}
        >
          登录
        </Link>
        <Link
          to="/register"
          style={{
            padding: '6px 14px',
            background: 'hsl(var(--btn-primary))',
            color: '#fff',
            fontSize: 14,
            fontWeight: 500,
            textDecoration: 'none',
            borderRadius: 8,
            transition: 'opacity 0.2s',
          }}
        >
          注册
        </Link>
      </div>
    );
  }

  // 已登录：显示头像下拉菜单
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowDropdown((s) => !s)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '4px 8px 4px 4px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          borderRadius: 20,
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'hsl(var(--muted))'; }}
        onMouseLeave={(e) => { if (!showDropdown) e.currentTarget.style.background = 'transparent'; }}
      >
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'hsl(var(--btn-primary) / 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
        }}>
          {avatar || '🙂'}
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {showDropdown && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
            }}
            onClick={() => setShowDropdown(false)}
          />
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 8,
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            minWidth: 180,
            zIndex: 1000,
            overflow: 'hidden',
          }}>
            {/* 用户信息 */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid hsl(var(--border))' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'hsl(var(--foreground))' }}>
                {nickname || '社区用户'}
              </div>
              <div style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', marginTop: 2 }}>
                {user.email}
              </div>
            </div>

            {/* 菜单项 */}
            <Link
              to="/profile"
              onClick={() => setShowDropdown(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 16px',
                color: 'hsl(var(--foreground))',
                fontSize: 14,
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'hsl(var(--muted))'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              个人中心
            </Link>

            <Link
              to="/chat"
              onClick={() => setShowDropdown(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 16px',
                color: 'hsl(var(--foreground))',
                fontSize: 14,
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'hsl(var(--muted))'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              我的消息
            </Link>

            <div style={{ borderTop: '1px solid hsl(var(--border))' }} />

            <button
              onClick={async () => {
                setShowDropdown(false);
                await supabase.auth.signOut();
                window.location.href = '/';
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 16px',
                color: '#ef4444',
                fontSize: 14,
                background: 'transparent',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              退出登录
            </button>
          </div>
        </>
      )}
    </div>
  );
}
