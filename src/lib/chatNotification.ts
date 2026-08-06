// 客户端本地未读红点、最近访问记录（不操作数据库）
const ACTIVITY_KEY = 'meshroc_chat_activity';

export function markAsRead(...ids) {
  if (typeof localStorage === 'undefined') return;
  const raw = localStorage.getItem(ACTIVITY_KEY);
  const map = raw ? JSON.parse(raw) : {};
  ids.forEach((id) => {
    if (map[id]) map[id].unread = false;
  });
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(map));
}

export function recordActivity(type, targetId) {
  if (typeof localStorage === 'undefined') return;
  const raw = localStorage.getItem(ACTIVITY_KEY);
  const map = raw ? JSON.parse(raw) : {};
  map[targetId] = {
    unread: true,
    lastType: type,
    ts: Date.now(),
  };
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(map));
}

export function getActivityMap() {
  if (typeof localStorage === 'undefined') return {};
  const raw = localStorage.getItem(ACTIVITY_KEY);
  return raw ? JSON.parse(raw) : {};
}
