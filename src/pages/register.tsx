import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { supabase } from '@/supabase/supabaseClient';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('密码长度至少6位');
      setLoading(false);
      return;
    }

    try {
      // 1. 注册账号
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            username: username.trim(),
            nickname: nickname.trim() || username.trim(),
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. 创建 profiles 表记录
        const { error: profileError } = await supabase.from('profiles').insert([{
          id: authData.user.id,
          username: username.trim(),
          nickname: nickname.trim() || username.trim(),
          email: email.trim(),
          avatar_url: '🙂',
          signature: '这家伙很懒，什么都没留下~',
          created_at: new Date().toISOString(),
        }]);

        if (profileError) {
          console.warn('创建 profile 失败：', profileError);
        }
      }

      setSuccess('注册成功！请检查邮箱验证后登录（如未收到邮件可直接尝试登录）');
    } catch (err: any) {
      setError(err.message || '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="注册" description="注册 MeshROC 社区">
      <div style={{
        maxWidth: 420,
        margin: '40px auto',
        padding: '36px 32px',
        background: 'hsl(var(--card))',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🚀</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'hsl(var(--foreground))' }}>
            加入 MeshROC 社区
          </h1>
          <p style={{ color: 'hsl(var(--muted-foreground))', marginTop: 8, fontSize: 14 }}>
            创建账号，开启你的离线无线互联之旅
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

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500, color: 'hsl(var(--foreground))' }}>
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="设置一个用户名"
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

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500, color: 'hsl(var(--foreground))' }}>
              昵称（可选）
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="显示在社区的昵称"
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

          <div style={{ marginBottom: 14 }}>
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

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500, color: 'hsl(var(--foreground))' }}>
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少6位字符"
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

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500, color: 'hsl(var(--foreground))' }}>
              确认密码
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="再次输入密码"
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
            {loading ? '注册中...' : '注册账号'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 14, color: 'hsl(var(--muted-foreground))' }}>
          已有账号？
          <Link to="/login" style={{ color: 'hsl(var(--btn-primary))', textDecoration: 'none', fontWeight: 500, marginLeft: 4 }}>
            立即登录
          </Link>
        </div>
      </div>
    </Layout>
  );
}
