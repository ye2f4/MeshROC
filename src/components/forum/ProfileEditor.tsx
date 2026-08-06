import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { safeGetUser } from '@/lib/supabase/safe';

const EMOJI_LIST = ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','😉','😊','😍','🤩','🥰','👦','👧','👨','👩','🐶','🐱','🐼','🦁','🐯','🦄','🐝','👻','🤖','👽'];

const inputStyle: React.CSSProperties = {
  padding: '12px 16px', border: '1px solid #ccc', borderRadius: 8, fontSize: 14, minHeight: 48, width: '100%', boxSizing: 'border-box',
};

export default function ProfileEditor({ user }: { user: any }) {
  const [form, setForm] = useState({ username: '', nickname: '', signature: '', gender: 'unknown', avatar_url: '🙂' as any });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (!active) return;
      if (data) {
        setForm({
          username: data.username || '',
          nickname: data.nickname || '',
          signature: data.signature || '',
          gender: data.gender || 'unknown',
          avatar_url: data.avatar_url || '🙂',
        });
      }
      setLoading(false);
    })();
    return () => { active = false; };
  }, [user.id]);

  const checkUsername = async (val: string) => {
    const v = val.trim();
    if (!v) { setMsg(''); return; }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(v)) { setMsg('用户名需 3-20 位，仅支持字母、数字、下划线'); return; }
    const { data } = await supabase.from('profiles').select('username').eq('username', v.toLowerCase()).maybeSingle();
    setMsg(data ? '该用户名已被占用' : '');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const uname = form.username.trim().toLowerCase();
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(uname)) { setMsg('用户名格式不合法'); return; }
    if (msg) return;
    setSaving(true);
    setMsg('');
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        username: uname,
        nickname: form.nickname.trim() || uname,
        signature: form.signature,
        gender: form.gender,
        avatar_url: form.avatar_url,
        email: user.email,
      }, { onConflict: 'id' });
      if (error) throw error;
      setMsg('保存成功');
    } catch (err: any) {
      setMsg(err.message || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40, color: 'var(--ifm-font-color-base)' }}>加载中…</div>;
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 44 }}>{form.avatar_url}</div>
        <details style={{ marginTop: 8 }}>
          <summary style={{ cursor: 'pointer', color: '#4285f4', fontSize: 13 }}>选择头像</summary>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginTop: 10 }}>
            {EMOJI_LIST.map((e) => (
              <button key={e} type="button" onClick={() => setForm((f) => ({ ...f, avatar_url: e }))} style={{ fontSize: 22, border: 'none', background: 'transparent', cursor: 'pointer' }}>{e}</button>
            ))}
          </div>
        </details>
      </div>
      <input style={inputStyle} placeholder="用户名（必填，3-20位）" value={form.username} onChange={(e) => { setForm((f) => ({ ...f, username: e.target.value })); checkUsername(e.target.value); }} required />
      <input style={inputStyle} placeholder="昵称（可选）" value={form.nickname} onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))} />
      <input style={inputStyle} placeholder="个性签名（可选）" value={form.signature} onChange={(e) => setForm((f) => ({ ...f, signature: e.target.value }))} />
      <select style={inputStyle} value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}>
        <option value="unknown">保密</option>
        <option value="male">男</option>
        <option value="female">女</option>
      </select>
      {msg && <div style={{ color: msg === '保存成功' ? '#34a853' : '#dc3545', textAlign: 'center', fontSize: 14 }}>{msg}</div>}
      <button type="submit" disabled={saving} style={{ padding: 12, background: '#07c160', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', minHeight: 48 }}>
        {saving ? '保存中…' : '保存资料'}
      </button>
    </form>
  );
}
