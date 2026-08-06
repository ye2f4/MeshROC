import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import { supabase } from '@/supabase/supabaseClient';
import { safeGetUser } from '@/lib/supabase/safe';

// 默认群聊配置：主群 + LongFast 频道
const DEFAULT_GROUPS = [
  {
    id: 'meshroc-main-group',
    group_name: 'MeshROC 主群',
    avatar_url: '🌐',
    description: 'MeshROC 社区主群，欢迎所有 LoRa Mesh 爱好者交流讨论',
  },
  {
    id: 'meshroc-longfast-channel',
    group_name: 'LongFast 频道',
    avatar_url: '📡',
    description: 'LongFast 调制参数专用频道，山地远距离通信技术交流',
  },
];

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [groupList, setGroupList] = useState<any[]>([]);
  const [currentGroup, setCurrentGroup] = useState<any>(null);
  const [groupMsgList, setGroupMsgList] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [userMap, setUserMap] = useState<Record<string, any>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 确保默认群存在
  const ensureDefaultGroups = async () => {
    for (const group of DEFAULT_GROUPS) {
      try {
        const { data: existing } = await supabase
          .from('groups')
          .select('id')
          .eq('id', group.id)
          .maybeSingle();

        if (!existing) {
          await supabase.from('groups').insert([{
            id: group.id,
            group_name: group.group_name,
            avatar_url: group.avatar_url,
            owner_id: 'system',
            is_top: false,
          }]);
        }
      } catch (err) {
        console.error('确保默认群存在失败：', err);
      }
    }
  };

  // 自动加入默认群
  const autoJoinDefaultGroups = async (userId: string) => {
    for (const group of DEFAULT_GROUPS) {
      try {
        const { data: existing } = await supabase
          .from('group_members')
          .select('group_id, user_id')
          .eq('group_id', group.id)
          .eq('user_id', userId)
          .maybeSingle();

        if (!existing) {
          await supabase.from('group_members').insert([{
            group_id: group.id,
            user_id: userId,
            joined_at: new Date().toISOString(),
          }]);
        }
      } catch (err) {
        console.error('自动加入群失败：', err);
      }
    }
  };

  // 加载我的群聊
  const fetchMyGroups = async (selfUid: string) => {
    try {
      const { data: memberData, error: memberErr } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', selfUid);

      if (memberErr) throw memberErr;
      if (!memberData || memberData.length === 0) {
        setGroupList([]);
        return;
      }

      const groupIds = memberData.map((item: any) => item.group_id);
      const { data: groups, error: groupErr } = await supabase
        .from('groups')
        .select('id, group_name, avatar_url, owner_id, is_top')
        .in('id', groupIds)
        .order('is_top', { ascending: false });

      if (groupErr) throw groupErr;
      setGroupList(groups || []);

      // 默认选中第一个群
      if (groups && groups.length > 0 && !currentGroup) {
        selectGroup(groups[0]);
      }
    } catch (err) {
      console.error('加载群聊失败：', err);
    }
  };

  // 加载群消息
  const fetchGroupMessages = async (groupId: string) => {
    if (!currentUser || !groupId) return;
    try {
      const { data: msgData, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (msgError) throw msgError;
      if (!msgData) {
        setGroupMsgList([]);
        scrollToBottom();
        return;
      }

      // 收集发送者ID
      const userIds = [...new Set(msgData.map((m: any) => m.from_user_id))];
      const { data: users } = await supabase
        .from('profiles')
        .select('id, nickname, avatar_url, username')
        .in('id', userIds);

      const map: Record<string, any> = {};
      (users || []).forEach((u: any) => { map[u.id] = u; });
      setUserMap(map);

      setGroupMsgList(msgData.map((m: any) => ({ ...m, sender: map[m.from_user_id] || {} })));
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error('加载群聊消息失败：', err);
    }
  };

  // 选择群聊
  const selectGroup = (group: any) => {
    setCurrentGroup(group);
    fetchGroupMessages(group.id);
  };

  // 发送消息
  const sendMessage = async () => {
    const txt = inputValue.trim();
    if (!txt || !currentUser || !currentGroup) return;

    try {
      const { error } = await supabase.from('messages').insert([{
        from_user_id: currentUser.id,
        to_user_id: currentUser.id,
        group_id: currentGroup.id,
        content: txt,
        created_at: new Date().toISOString(),
      }]);

      if (error) throw error;
      setInputValue('');
      fetchGroupMessages(currentGroup.id);
    } catch (err) {
      console.error('发送消息失败：', err);
    }
  };

  // 初始化
  useEffect(() => {
    const init = async () => {
      try {
        const { user } = await safeGetUser();
        setCurrentUser(user);

        if (user) {
          await ensureDefaultGroups();
          await autoJoinDefaultGroups(user.id);
          await fetchMyGroups(user.id);
        }
      } catch (err) {
        console.error('聊天页初始化失败：', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // 实时监听新消息
  useEffect(() => {
    if (!currentGroup?.id) return;

    const channel = supabase
      .channel(`group-${currentGroup.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `group_id=eq.${currentGroup.id}`,
      }, (payload) => {
        const newMsg = payload.new as any;
        setGroupMsgList((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          const updated = [...prev, { ...newMsg, sender: userMap[newMsg.from_user_id] || {} }];
          setTimeout(scrollToBottom, 100);
          return updated;
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentGroup?.id, userMap]);

  // 格式化时间
  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Layout title="在线聊天室" description="MeshROC 社区在线聊天室">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div style={{ color: 'hsl(var(--muted-foreground))' }}>加载中...</div>
        </div>
      </Layout>
    );
  }

  if (!currentUser) {
    return (
      <Layout title="在线聊天室" description="MeshROC 社区在线聊天室">
        <div style={{ maxWidth: 480, margin: '80px auto', padding: '40px 32px', background: 'hsl(var(--card))', borderRadius: 16, textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
          <h2 style={{ fontSize: 22, marginBottom: 12, color: 'hsl(var(--foreground))' }}>欢迎来到 MeshROC 在线聊天室</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: 24, fontSize: 14, lineHeight: 1.6 }}>
            登录后即可参与社区群聊，与全国各地的 LoRa Mesh 爱好者实时交流
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <a href="/login" style={{ padding: '10px 24px', background: 'hsl(var(--btn-primary))', color: '#fff', borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
              立即登录
            </a>
            <a href="/register" style={{ padding: '10px 24px', background: 'transparent', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--border))', borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
              注册账号
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="在线聊天室" description="MeshROC 社区在线聊天室">
      <div style={{ display: 'flex', height: 'calc(100vh - var(--ifm-navbar-height))', background: 'hsl(var(--background))' }}>
        {/* 左侧群列表 */}
        <div style={{ width: 280, borderRight: '1px solid hsl(var(--border))', display: 'flex', flexDirection: 'column', background: 'hsl(var(--muted) / 0.3)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid hsl(var(--border))' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: 'hsl(var(--foreground))' }}>在线聊天室</h2>
            <p style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', margin: '4px 0 0' }}>MeshROC 社区群聊</p>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
            {groupList.map((group) => (
              <div
                key={group.id}
                onClick={() => selectGroup(group)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  marginBottom: 4,
                  background: currentGroup?.id === group.id ? 'hsl(var(--btn-primary) / 0.1)' : 'transparent',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => { if (currentGroup?.id !== group.id) e.currentTarget.style.background = 'hsl(var(--muted))'; }}
                onMouseLeave={(e) => { if (currentGroup?.id !== group.id) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'hsl(var(--btn-primary) / 0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
                }}>
                  {group.avatar_url || '👥'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'hsl(var(--foreground))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {group.group_name}
                  </div>
                  <div style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', marginTop: 2 }}>
                    {DEFAULT_GROUPS.find((g) => g.id === group.id)?.description || '社区群聊'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧聊天区 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* 群聊头部 */}
          {currentGroup ? (
            <div style={{ padding: '14px 24px', borderBottom: '1px solid hsl(var(--border))', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'hsl(var(--btn-primary) / 0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18,
              }}>
                {currentGroup.avatar_url || '👥'}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'hsl(var(--foreground))' }}>{currentGroup.group_name}</div>
                <div style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>
                  {DEFAULT_GROUPS.find((g) => g.id === currentGroup.id)?.description || ''}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '14px 24px', borderBottom: '1px solid hsl(var(--border))' }}>
              <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: 14 }}>选择一个群聊开始对话</span>
            </div>
          )}

          {/* 消息列表 */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
            {groupMsgList.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'hsl(var(--muted-foreground))', padding: '60px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
                <p>还没有消息，快来发送第一条吧！</p>
              </div>
            ) : (
              groupMsgList.map((msg) => {
                const isSelf = msg.from_user_id === currentUser.id;
                return (
                  <div key={msg.id} style={{
                    display: 'flex',
                    flexDirection: isSelf ? 'row-reverse' : 'row',
                    gap: 10,
                    marginBottom: 16,
                    alignItems: 'flex-start',
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'hsl(var(--btn-primary) / 0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, flexShrink: 0,
                    }}>
                      {msg.sender?.avatar_url || (isSelf ? '🙂' : '👤')}
                    </div>
                    <div style={{ maxWidth: '60%' }}>
                      {!isSelf && (
                        <div style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', marginBottom: 4 }}>
                          {msg.sender?.nickname || msg.sender?.username || '匿名用户'}
                          <span style={{ marginLeft: 8 }}>{formatTime(msg.created_at)}</span>
                        </div>
                      )}
                      <div style={{
                        padding: '10px 14px',
                        borderRadius: isSelf ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
                        background: isSelf ? 'hsl(var(--btn-primary))' : 'hsl(var(--muted))',
                        color: isSelf ? '#fff' : 'hsl(var(--foreground))',
                        fontSize: 14,
                        lineHeight: 1.5,
                        wordBreak: 'break-word',
                      }}>
                        {msg.content}
                      </div>
                      {isSelf && (
                        <div style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', marginTop: 4, textAlign: 'right' }}>
                          {formatTime(msg.created_at)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入框 */}
          {currentGroup && (
            <div style={{ padding: '16px 24px', borderTop: '1px solid hsl(var(--border))' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="输入消息，按 Enter 发送..."
                  rows={2}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 12,
                    fontSize: 14,
                    resize: 'none',
                    outline: 'none',
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--foreground))',
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim()}
                  style={{
                    padding: '10px 20px',
                    background: inputValue.trim() ? 'hsl(var(--btn-primary))' : 'hsl(var(--muted))',
                    color: inputValue.trim() ? '#fff' : 'hsl(var(--muted-foreground))',
                    border: 'none',
                    borderRadius: 10,
                    cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                    fontSize: 14,
                    fontWeight: 500,
                    height: 44,
                  }}
                >
                  发送
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
