import { useState } from 'react';
import { Link } from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router';
import { translate } from '@docusaurus/Translate';
import { supabase } from '@/lib/supabase/client';
import { SUPABASE_URL } from '@/lib/supabase/config';

const t = (...args) => {
  const [opts, values] = args;
  if (typeof opts === 'string') return translate({ id: opts }, values);
  const vals = values ?? opts?.values ?? (opts?.count !== undefined ? { count: opts.count } : undefined);
  return translate(opts, vals);
};

export default function LoginPage() {
  const history = useHistory();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (e) => {
    e.preventDefault();
    if (loading) return;
    const { email, password } = form;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('请输入有效的邮箱地址'); return; }
    setLoading(true);
    setError('');
    try {
      const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signErr) throw signErr;
      history.replace('/profile');
    } catch (err) {
      setError(err.message || t({ id: 'login.fail', message: '登录失败，请检查邮箱或密码' }));
    } finally {
      setLoading(false);
    }
  };

  const oauth = async (provider) => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${SUPABASE_URL}/auth/v1/callback` } });
    if (error) { setError(error.message); setLoading(false); }
  };

  const bilibiliOAuth = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'bilibili',
          options: { redirectTo: `${window.location.origin}/profile` },
        });
        if (error) throw error;
        return;
      }
      const { data, error: fnErr } = await supabase.functions.invoke('bilibili-oauth', { body: { action: 'login' } });
      if (fnErr) throw fnErr;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        history.replace('/profile');
      }
    } catch (err) {
      setError(err.message || '哔哩哔哩登录失败');
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ maxWidth: 920, margin: '0 auto', padding: '3rem 1.25rem 4rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '2.5rem', alignItems: 'center' }}>
        <aside style={{ display: 'none' }} className="login-aside">
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 1rem' }}>Monoの小窝</h1>
          <p style={{ color: 'var(--ifm-color-emphasis-600)', lineHeight: 1.8 }}>
            欢迎回来。登录后即可参与社区讨论、管理你的节点与固件。
          </p>
          <p style={{ marginTop: '1.5rem', fontSize: '.9rem', color: 'var(--ifm-color-emphasis-500)' }}>
            还没有账号？<Link to="/register" style={{ color: 'var(--ifm-color-primary)' }}>立即注册</Link>
          </p>
        </aside>

        <section style={{ background: 'var(--ifm-card-background)', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: 16, padding: '2rem' }}>
          <h2 style={{ marginTop: 0, marginBottom: '1.25rem', fontSize: '1.35rem' }}>{t({ id: 'login.title', message: '登录 Monoの小窝' })}</h2>
          <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input type="email" placeholder="邮箱" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required style={{ padding: '12px 16px', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, fontSize: 14, minHeight: 48 }} />
            <input type="password" placeholder="密码" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required style={{ padding: '12px 16px', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, fontSize: 14, minHeight: 48 }} />
            {error && <div style={{ color: '#dc3545', fontSize: 13 }}>{error}</div>}
            <button type="submit" disabled={loading} style={{ padding: 12, background: 'var(--ifm-color-primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', minHeight: 48 }}>
              {loading ? '登录中…' : t({ id: 'login.submit', message: '登录' })}
            </button>
          </form>
          <div style={{ textAlign: 'center', color: 'var(--ifm-color-emphasis-500)', fontSize: 13, margin: '14px 0' }}>或使用第三方账号</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={() => oauth('github')} disabled={loading} style={{ flex: 1, padding: 12, border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, background: '#24292e', color: '#fff', cursor: 'pointer', fontSize: 14 }}>GitHub</button>
            <button type="button" onClick={bilibiliOAuth} disabled={loading} style={{ flex: 1, padding: 12, border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, background: '#fb7299', color: '#fff', cursor: 'pointer', fontSize: 14 }}>哔哩哔哩</button>
          </div>
          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '.85rem' }}>
            <Link to="/complete-profile" style={{ color: 'var(--ifm-color-primary)' }}>已有账号但需完善资料？</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
