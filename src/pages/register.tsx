import { useState } from 'react';
import { Link } from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router';
import { translate } from '@docusaurus/Translate';
import { supabase } from '@/lib/supabase/client';
import { safeGetUser } from '@/lib/supabase/safe';

const t = (...args) => {
  const [opts, values] = args;
  if (typeof opts === 'string') return translate({ id: opts }, values);
  const vals = values ?? opts?.values ?? (opts?.count !== undefined ? { count: opts.count } : undefined);
  return translate(opts, vals);
};

export default function RegisterPage() {
  const history = useHistory();
  const [step, setStep] = useState(1); // 1 基本信息; 2 完善资料
  const [form, setForm] = useState({ email: '', password: '', username: '', nickname: '', signature: '', gender: 'unknown' });
  const [avatar, setAvatar] = useState('😀');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const checkUsername = async (val) => {
    const v = val.trim();
    if (!v) { setError(''); return; }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(v)) { setError('用户名需 3-20 位，仅支持字母、数字、下划线'); return; }
    const { data } = await supabase.from('profiles').select('username').eq('username', v.toLowerCase()).maybeSingle();
    setError(data ? '该用户名已被占用' : '');
  };

  const signUp = async (e) => {
    e.preventDefault();
    if (loading) return;
    const { email, password } = form;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('请输入有效的邮箱地址'); return; }
    if (password.length < 6) { setError('密码至少 6 位'); return; }
    setLoading(true);
    setError('');
    try {
      const { data, error: signErr } = await supabase.auth.signUp({ email, password });
      if (signErr) throw signErr;
      if (data.user) {
        const uname = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') || `user_${data.user.id.slice(0, 6)}`;
        const { error: profErr } = await supabase.from('profiles').upsert({
          id: data.user.id,
          username: uname,
          nickname: form.nickname.trim() || uname,
          signature: form.signature,
          gender: form.gender,
          avatar_url: avatar,
          email,
        }, { onConflict: 'id' });
        if (profErr) throw profErr;
      }
      setSuccess(t({ id: 'register.success', message: '注册成功！请查收验证邮件以激活账号。' }));
      setTimeout(() => history.push('/profile'), 1200);
    } catch (err) {
      setError(err.message || t({ id: 'register.fail', message: '注册失败，请稍后重试' }));
    } finally {
      setLoading(false);
    }
  };

  const oauth = async (provider) => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/profile` } });
    if (error) { setError(error.message); setLoading(false); }
  };

  const fillProfile = async (e) => {
    e.preventDefault();
    if (loading) return;
    const uname = form.username.trim().toLowerCase();
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(uname)) { setError('用户名需 3-20 位，仅支持字母、数字、下划线'); return; }
    setLoading(true);
    setError('');
    try {
      const { user } = await safeGetUser();
      if (!user) { history.push('/login'); return; }
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        username: uname,
        nickname: form.nickname.trim() || uname,
        signature: form.signature,
        gender: form.gender,
        avatar_url: avatar,
        email: user.email,
      }, { onConflict: 'id' });
      if (error) throw error;
      history.push('/profile');
    } catch (err) {
      setError(err.message || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ maxWidth: 920, margin: '0 auto', padding: '3rem 1.25rem 4rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '2.5rem', alignItems: 'center' }}>
        {/* 左侧：品牌 + 卖点 */}
        <aside style={{ display: 'none' }} className="register-aside">
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 1rem' }}>Monoの小窝</h1>
          <p style={{ color: 'var(--ifm-color-emphasis-600)', lineHeight: 1.8 }}>
            注册即可加入社区：发帖、评论、管理你的节点与固件。
          </p>
          <ul style={{ color: 'var(--ifm-color-emphasis-600)', lineHeight: 2, paddingLeft: '1.2rem' }}>
            <li>发布与回复主题</li>
            <li>在任意页面留言互动</li>
            <li>管理你的 MeshROC 设备</li>
            <li>与 B 站账号互通</li>
          </ul>
          <p style={{ marginTop: '1.5rem', fontSize: '.9rem', color: 'var(--ifm-color-emphasis-500)' }}>
            已有账号？<Link to="/login" style={{ color: 'var(--ifm-color-primary)' }}>立即登录</Link>
          </p>
        </aside>

        {/* 右侧：表单 */}
        <section style={{ background: 'var(--ifm-card-background)', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: 16, padding: '2rem' }}>
          <h2 style={{ marginTop: 0, marginBottom: '1.25rem', fontSize: '1.35rem' }}>{t({ id: 'register.title', message: '注册 Monoの小窝' })}</h2>

          {success ? (
            <div style={{ color: '#34a853', textAlign: 'center', padding: '1rem' }}>{success}</div>
          ) : (
            <form onSubmit={step === 1 ? signUp : fillProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {step === 1 ? (
                <>
                  <input type="email" placeholder="邮箱" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required style={{ padding: '12px 16px', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, fontSize: 14, minHeight: 48 }} />
                  <input type="password" placeholder="密码（至少 6 位）" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required style={{ padding: '12px 16px', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, fontSize: 14, minHeight: 48 }} />
                  {error && <div style={{ color: '#dc3545', fontSize: 13 }}>{error}</div>}
                  <button type="submit" disabled={loading} style={{ padding: 12, background: 'var(--ifm-color-primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', minHeight: 48 }}>
                    {loading ? '处理中…' : t({ id: 'register.next', message: '下一步' })}
                  </button>
                  <div style={{ textAlign: 'center', color: 'var(--ifm-color-emphasis-500)', fontSize: 13, margin: '4px 0' }}>或使用第三方账号</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="button" onClick={() => oauth('github')} disabled={loading} style={{ flex: 1, padding: 12, border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, background: '#24292e', color: '#fff', cursor: 'pointer', fontSize: 14 }}>GitHub</button>
                    <button type="button" onClick={() => oauth('bilibili')} disabled={loading} style={{ flex: 1, padding: 12, border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, background: '#fb7299', color: '#fff', cursor: 'pointer', fontSize: 14 }}>哔哩哔哩</button>
                  </div>
                  <button type="button" onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: 'var(--ifm-color-primary)', cursor: 'pointer', fontSize: 13 }}>已有账号，直接完善资料 →</button>
                </>
              ) : (
                <>
                  <input placeholder="用户名（必填，3-20位）" value={form.username} onChange={(e) => { setForm((f) => ({ ...f, username: e.target.value })); checkUsername(e.target.value); }} required style={{ padding: '12px 16px', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, fontSize: 14, minHeight: 48 }} />
                  <input placeholder="昵称（可选）" value={form.nickname} onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))} style={{ padding: '12px 16px', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, fontSize: 14, minHeight: 48 }} />
                  <input placeholder="个性签名（可选）" value={form.signature} onChange={(e) => setForm((f) => ({ ...f, signature: e.target.value }))} style={{ padding: '12px 16px', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, fontSize: 14, minHeight: 48 }} />
                  <select value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))} style={{ padding: '12px 16px', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, fontSize: 14, minHeight: 48 }}>
                    <option value="unknown">保密</option>
                    <option value="male">男</option>
                    <option value="female">女</option>
                  </select>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 40 }}>{avatar}</div>
                    <details style={{ marginTop: 6 }}>
                      <summary style={{ cursor: 'pointer', color: 'var(--ifm-color-primary)', fontSize: 13 }}>选择头像</summary>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginTop: 10 }}>
                        {['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','😉','😊','😍','🤩','🥰','👦','👧','👨','👩','🐶','🐱','🐼','🦁','🐯','🦄','🐝','👻','🤖','👽'].map((e) => (
                          <button key={e} type="button" onClick={() => setAvatar(e)} style={{ fontSize: 22, border: 'none', background: 'transparent', cursor: 'pointer' }}>{e}</button>
                        ))}
                      </div>
                    </details>
                  </div>
                  {error && <div style={{ color: '#dc3545', fontSize: 13 }}>{error}</div>}
                  <button type="submit" disabled={loading} style={{ padding: 12, background: 'var(--ifm-color-primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', minHeight: 48 }}>
                    {loading ? '保存中…' : t({ id: 'register.submit', message: '完成注册' })}
                  </button>
                  <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--ifm-color-primary)', cursor: 'pointer', fontSize: 13 }}>← 返回上一步</button>
                </>
              )}
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
