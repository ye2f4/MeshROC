import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { supabase } from '@/supabase/supabaseClient';
import { safeGetUser } from '@/lib/supabase/safe';

const EMOJI_LIST = ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','😉','😊','😍','🤩','🥰','👦','👧','👨','👩','🐶','🐱','🐼','🦁','🐯','🦄','🐝','👻','🤖','👽','🏔️','📡','🔋','⚡','🛰️'];

type Profile = {
  username: string;
  nickname: string;
  email: string;
  signature: string;
  gender: string;
  birthday: string;
  address: string;
  avatar_url: string;
  real_name: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [pwd, setPwd] = useState({ old: '', next: '' });

  const genderMap: Record<string, string> = { unknown: '保密', male: '男', female: '女' };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err: any) {
      console.error('加载个人资料失败：', err);
      setError('加载个人资料失败');
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const { user: u } = await safeGetUser();
        setUser(u);
        if (u) {
          await fetchProfile(u.id);
        }
      } catch (err) {
        console.error('个人资料页初始化失败：', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleChange = (key: keyof Profile, value: string) => {
    setProfile((p) => (p ? { ...p, [key]: value } : p));
  };

  const saveProfile = async () => {
    if (!profile || !user) return;
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nickname: profile.nickname.trim(),
          signature: profile.signature,
          gender: profile.gender,
          birthday: profile.birthday || null,
          address: profile.address,
          avatar_url: profile.avatar_url,
          real_name: profile.real_name,
        })
        .eq('id', user.id);

      if (error) throw error;
      setMessage('保存成功 ✅');
      setTimeout(() => setMessage(''), 3000);
    } catch (e: any) {
      setError(e.message || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const checkNickname = async (val: string) => {
    const v = val.trim();
    if (!v) { setError(''); return; }
    if (!/^[一-龥a-zA-Z0-9_]{1,20}$/.test(v)) {
      setError('昵称格式不合法（支持中文、英文、数字、下划线，最多20字）');
      return;
    }
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('nickname', v)
      .neq('id', user.id)
      .maybeSingle();
    setError(data ? '昵称已被占用' : '');
  };

  const changePassword = async () => {
    setSaving(true);
    setError('');
    setMessage('');

    try {
      if (!pwd.old || !pwd.next) throw new Error('请填写完整');
      if (pwd.next.length < 6) throw new Error('新密码至少6位');

      const { user: u } = await safeGetUser();
      if (!u?.email) throw new Error('会话缺失');

      const { error: reauthErr } = await supabase.auth.signInWithPassword({
        email: u.email,
        password: pwd.old,
      });
      if (reauthErr) throw new Error('原密码错误');

      const { error } = await supabase.auth.updateUser({ password: pwd.next });
      if (error) throw error;

      setMessage('密码已修改 ✅');
      setPwd({ old: '', next: '' });
      setShowPwd(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (e: any) {
      setError(e.message || '修改失败');
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <Layout title="个人中心" description="MeshROC 个人中心">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div style={{ color: 'hsl(var(--muted-foreground))' }}>加载中...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout title="个人中心" description="MeshROC 个人中心">
        <div style={{ maxWidth: 420, margin: '80px auto', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ color: 'hsl(var(--foreground))' }}>请先登录</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: 24 }}>登录后查看和编辑个人资料</p>
          <a href="/login" style={{
            padding: '10px 24px',
            background: 'hsl(var(--btn-primary))',
            color: '#fff',
            borderRadius: 10,
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 500,
          }}>
            去登录
          </a>
        </div>
      </Layout>
    );
  }

  const inputStyle: React.CSSProperties = {
    padding: '10px 14px',
    border: '1px solid hsl(var(--border))',
    borderRadius: 8,
    fontSize: 14,
    minHeight: 44,
    background: 'hsl(var(--background))',
    color: 'hsl(var(--foreground))',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 6,
    fontWeight: 600,
    color: 'hsl(var(--foreground))',
    fontSize: 14,
  };

  const fieldStyle: React.CSSProperties = { marginBottom: 16 };

  return (
    <Layout title="个人中心" description="MeshROC 个人中心">
      <main style={{
        maxWidth: 880,
        margin: '0 auto',
        padding: '32px 24px',
        background: 'hsl(var(--card))',
        minHeight: 'calc(100vh - var(--ifm-navbar-height))',
        boxSizing: 'border-box',
      }}>
        <h1 style={{ fontSize: 24, marginBottom: 24, color: 'hsl(var(--foreground))' }}>个人中心</h1>

        {/* 头像和基本信息 */}
        <div style={{ ...fieldStyle, display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 20, borderBottom: '1px solid hsl(var(--border))' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowEmoji((s) => !s)}
              style={{
                fontSize: 48,
                border: 'none',
                background: 'hsl(var(--btn-primary) / 0.1)',
                cursor: 'pointer',
                width: 72,
                height: 72,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {profile?.avatar_url || '🙂'}
            </button>
            {showEmoji && (
              <div style={{
                position: 'absolute',
                top: 80,
                left: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(7,1fr)',
                gap: 4,
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 8,
                padding: 8,
                zIndex: 10,
                maxWidth: 280,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}>
                {EMOJI_LIST.map((e) => (
                  <button
                    key={e}
                    onClick={() => { handleChange('avatar_url', e); setShowEmoji(false); }}
                    style={{
                      fontSize: 22,
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      padding: 4,
                      borderRadius: 6,
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'hsl(var(--foreground))' }}>
              {profile?.nickname || user.email}
            </div>
            <div style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', marginTop: 4 }}>
              @{profile?.username || user.id} · {genderMap[profile?.gender || 'unknown']}
            </div>
            {profile?.signature && (
              <div style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', marginTop: 4 }}>
                {profile.signature}
              </div>
            )}
          </div>
          <button
            onClick={logout}
            style={{
              padding: '8px 16px',
              border: '1px solid #ef4444',
              color: '#ef4444',
              background: 'transparent',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            退出登录
          </button>
        </div>

        {/* 个人资料编辑 */}
        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 18, marginBottom: 16, color: 'hsl(var(--foreground))' }}>基本资料</h2>

          <div style={fieldStyle}>
            <label style={labelStyle}>昵称</label>
            <input
              style={inputStyle}
              value={profile?.nickname || ''}
              onChange={(e) => { handleChange('nickname', e.target.value); checkNickname(e.target.value); }}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>个性签名</label>
            <input
              style={inputStyle}
              value={profile?.signature || ''}
              onChange={(e) => handleChange('signature', e.target.value)}
              placeholder="这家伙很懒~"
            />
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ ...fieldStyle, flex: 1 }}>
              <label style={labelStyle}>性别</label>
              <select
                style={inputStyle}
                value={profile?.gender || 'unknown'}
                onChange={(e) => handleChange('gender', e.target.value)}
              >
                <option value="unknown">保密</option>
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>

            <div style={{ ...fieldStyle, flex: 1 }}>
              <label style={labelStyle}>生日</label>
              <input
                type="date"
                style={inputStyle}
                value={profile?.birthday || ''}
                onChange={(e) => handleChange('birthday', e.target.value)}
              />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>所在地区</label>
            <input
              style={inputStyle}
              value={profile?.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="如：北京"
            />
          </div>

          {error && (
            <div style={{ color: '#ef4444', marginBottom: 12, fontSize: 14 }}>{error}</div>
          )}
          {message && (
            <div style={{ color: '#22c55e', marginBottom: 12, fontSize: 14 }}>{message}</div>
          )}

          <button
            onClick={saveProfile}
            disabled={saving}
            style={{
              width: '100%',
              padding: 12,
              background: 'hsl(var(--btn-primary))',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              minHeight: 48,
            }}
          >
            {saving ? '保存中...' : '保存资料'}
          </button>
        </div>

        {/* 修改密码 */}
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid hsl(var(--border))' }}>
          <button
            onClick={() => setShowPwd((s) => !s)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'hsl(var(--foreground))',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>{showPwd ? '▼' : '▶'}</span>
            修改密码
          </button>

          {showPwd && (
            <div style={{ marginTop: 16 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>原密码</label>
                <input
                  type="password"
                  style={inputStyle}
                  value={pwd.old}
                  onChange={(e) => setPwd((p) => ({ ...p, old: e.target.value }))}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>新密码</label>
                <input
                  type="password"
                  style={inputStyle}
                  value={pwd.next}
                  onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))}
                  placeholder="至少6位字符"
                />
              </div>
              <button
                onClick={changePassword}
                disabled={saving}
                style={{
                  width: '100%',
                  padding: 12,
                  background: 'hsl(var(--muted))',
                  color: 'hsl(var(--foreground))',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  minHeight: 48,
                }}
              >
                {saving ? '修改中...' : '确认修改密码'}
              </button>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
