import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { supabase } from '@/supabase/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      setSuccess('登录成功，正在跳转...');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (err: any) {
      setError(err.message || '登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="登录" description="登录 MeshROC 社区">
      <div style={{
        maxWidth: 420,
        margin: '60px auto',
        padding: '40px 32px',
        background: 'hsl(var(--card))',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📡</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'hsl(var(--foreground))' }}>
            欢迎回来
          </h1>
          <p style={{ color: 'hsl(var(--muted-foreground))', marginTop: 8, fontSize: 14 }}>
            登录 MeshROC 社区，参与在线讨论
          </p>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 8,
            color: '#ef4444',
            fontSize: 13,
            marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '10px 14px',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: 8,
            color: '#22c55e',
            fontSize: 13,
            marginBottom: 16,
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500, color: 'hsl(var(--foreground))' }}>
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱地址"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid hsl(var(--border))',
                borderRadius: 10,
                fontSize: 14,
                outline: 'none',
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500, color: 'hsl(var(--foreground))' }}>
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid hsl(var(--border))',
                borderRadius: 10,
                fontSize: 14,
                outline: 'none',
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'hsl(var(--btn-primary))',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'hsl(var(--muted-foreground))' }}>
          还没有账号？
          <Link to="/register" style={{ color: 'hsl(var(--btn-primary))', textDecoration: 'none', fontWeight: 500, marginLeft: 4 }}>
            立即注册
          </Link>
        </div>

        <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid hsl(var(--border))' }}>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'hsl(var(--muted-foreground))', margin: 0 }}>
            登录即表示同意社区服务条款和隐私政策
          </p>
        </div>
      </div>
    </Layout>
  );
}
