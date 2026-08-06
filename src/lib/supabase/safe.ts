import { supabase } from './client';

// 鉴权请求超时：supabase.co 在国内网络偶发不可达/极慢，
// 若不设超时，getUser/getSession 会永远 pending，导致页面「加载中」无限转圈。
const AUTH_TIMEOUT_MS = 8000;

function withTimeout<T>(promise: Promise<T>, ms: number = AUTH_TIMEOUT_MS): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('auth request timeout')), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

// 安全的会话/用户读取：吞掉异常与超时，返回中性值，避免整页白屏或无限加载
export async function safeGetSession() {
  try {
    const { data, error } = await withTimeout(supabase.auth.getSession());
    if (error) {
      return { session: null, user: null };
    }
    return { session: data.session, user: data.session?.user ?? null };
  } catch {
    return { session: null, user: null };
  }
}

export async function safeGetUser() {
  try {
    const { data, error } = await withTimeout(supabase.auth.getUser());
    if (error) {
      return { user: null };
    }
    return { user: data.user ?? null };
  } catch {
    return { user: null };
  }
}
