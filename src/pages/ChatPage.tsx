import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompanion } from '../context/CompanionContext';
import { AnimalCompanion } from '../components/AnimalCompanion/AnimalCompanion';
import { COMPANIONS } from '../components/AnimalCompanion/animalData';
import { api } from '../services/api';
import { ChatSession, ChatMessage } from '../types';
import {
  Sparkles,
  Send,
  Plus,
  Trash2,
  Menu,
  X,
  MessageCircleHeart,
  Calendar,
  AlertCircle,
} from 'lucide-react';

// Helpers to guarantee unique items and keys across renders
function dedupeMessages(list: ChatMessage[]): ChatMessage[] {
  const seen = new Set<string>();
  const result: ChatMessage[] = [];
  for (const item of list) {
    if (!item) continue;
    const key = item.id || `${item.created_at}-${item.content.substring(0, 30)}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

function dedupeSessions(list: ChatSession[]): ChatSession[] {
  const seen = new Set<string>();
  const result: ChatSession[] = [];
  for (const item of list) {
    if (!item || !item.id) continue;
    if (!seen.has(item.id)) {
      seen.add(item.id);
      result.push(item);
    }
  }
  return result;
}

export const ChatPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();
  const { companionType, openBreathingExercise, openSelector } = useCompanion();
  const companion = COMPANIONS[companionType] || COMPANIONS.capybara;

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dynamic Companion state based on chat events (typing, thinking, resting)
  const companionChatState = isSending
    ? 'thinking'
    : inputText.trim().length > 0
    ? 'listening'
    : 'idle';

  // Mobile sidebar open/close
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activeLoadingSessionIdRef = useRef<string | null>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  // Load all sessions
  const loadSessions = async () => {
    try {
      const data = await api.getSessions();
      const deduped = dedupeSessions(data.sessions || []);
      setSessions(deduped);
      return deduped;
    } catch (err) {
      console.error('Failed to load sessions:', err);
      return [];
    }
  };

  // Load specific session
  const loadSessionDetails = async (id: string) => {
    activeLoadingSessionIdRef.current = id;
    setLoadingHistory(true);
    setErrorMessage(null);
    try {
      const data = await api.getSession(id);
      // Guard against race conditions if user navigated while loading
      if (activeLoadingSessionIdRef.current === id) {
        setCurrentSession(data.session);
        setMessages(dedupeMessages(data.messages || []));
      }
    } catch (err: unknown) {
      if (activeLoadingSessionIdRef.current === id) {
        const msg = err instanceof Error ? err.message : 'Unable to load conversation.';
        setErrorMessage(msg);
        setCurrentSession(null);
        setMessages([]);
      }
    } finally {
      if (activeLoadingSessionIdRef.current === id) {
        setLoadingHistory(false);
      }
    }
  };

  // Initial mount & route change handler
  useEffect(() => {
    const init = async () => {
      const loaded = await loadSessions();
      if (sessionId) {
        await loadSessionDetails(sessionId);
      } else if (loaded.length > 0) {
        // Automatically open most recent session
        navigate(`/chat/${loaded[0].id}`, { replace: true });
      } else {
        setLoadingHistory(false);
      }
    };
    init();
  }, [sessionId, navigate]);

  const handleCreateNewChat = async () => {
    setErrorMessage(null);
    try {
      const res = await api.createSession('New Conversation');
      setSessions((prev) => dedupeSessions([res.session, ...prev]));
      setMobileSidebarOpen(false);
      navigate(`/chat/${res.session.id}`);
    } catch (err) {
      console.error('Create chat error:', err);
      setErrorMessage('Failed to start a new chat session.');
    }
  };

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this conversation permanently?')) return;

    try {
      await api.deleteSession(id);
      const remaining = sessions.filter((s) => s.id !== id);
      setSessions(dedupeSessions(remaining));

      if (sessionId === id) {
        if (remaining.length > 0) {
          navigate(`/chat/${remaining[0].id}`, { replace: true });
        } else {
          setCurrentSession(null);
          setMessages([]);
          navigate('/chat', { replace: true });
        }
      }
    } catch (err) {
      console.error('Delete session error:', err);
      alert('Could not delete session.');
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!content || isSending) return;

    // If no active session, create one first
    let activeId = sessionId;
    if (!activeId || !currentSession) {
      try {
        const res = await api.createSession('New Conversation');
        activeId = res.session.id;
        activeLoadingSessionIdRef.current = activeId;
        setSessions((prev) => dedupeSessions([res.session, ...prev]));
        setCurrentSession(res.session);
        navigate(`/chat/${activeId}`, { replace: true });
      } catch {
        setErrorMessage('Failed to initiate conversation.');
        return;
      }
    }

    // Optimistic user message update
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      session_id: activeId,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => dedupeMessages([...prev, tempUserMsg]));
    setInputText('');
    setIsSending(true);
    setErrorMessage(null);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const res = await api.sendMessage(activeId, content);
      // Replace optimistic message and prevent duplicate user/assistant messages
      setMessages((prev) => {
        const withoutTempOrReturned = prev.filter(
          (m) =>
            m.id !== tempUserMsg.id &&
            m.id !== res.userMessage.id &&
            m.id !== res.assistantMessage.id
        );
        return dedupeMessages([...withoutTempOrReturned, res.userMessage, res.assistantMessage]);
      });

      // Refresh sessions to get updated title & timestamp
      const updated = await api.getSessions();
      setSessions(dedupeSessions(updated.sessions || []));
      const cur = updated.sessions?.find((s) => s.id === activeId);
      if (cur) setCurrentSession(cur);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Group conversations by Today, Yesterday, Earlier
  const groupSessions = (list: ChatSession[]) => {
    const today: ChatSession[] = [];
    const yesterday: ChatSession[] = [];
    const earlier: ChatSession[] = [];

    const now = new Date();
    const yestDate = new Date(now);
    yestDate.setDate(now.getDate() - 1);

    list.forEach((s) => {
      const d = new Date(s.updated_at);
      if (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      ) {
        today.push(s);
      } else if (
        d.getDate() === yestDate.getDate() &&
        d.getMonth() === yestDate.getMonth() &&
        d.getFullYear() === yestDate.getFullYear()
      ) {
        yesterday.push(s);
      } else {
        earlier.push(s);
      }
    });

    return { today, yesterday, earlier };
  };

  const grouped = groupSessions(sessions);

  const quickPrompts = [
    'I feel lonely today.',
    'I have college stress and feel overwhelmed.',
    'Can we do a quick grounding exercise?',
    'I had a difficult day and need to vent.',
  ];

  return (
    <div
      id="chat-page-root"
      className="max-w-6xl mx-auto px-2 sm:px-4 py-3 md:py-4 h-[calc(100vh-4rem)] md:h-screen flex flex-col"
    >
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs flex overflow-hidden relative">
        {/* Mobile Sidebar Backdrop */}
        {mobileSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Conversation History Sidebar */}
        <aside
          id="chat-sidebar"
          className={`
            fixed md:relative z-30 inset-y-0 left-0
            w-72 sm:w-80 bg-[#fbfbf9] border-r border-slate-200/80
            flex flex-col transform transition-transform duration-200 ease-in-out
            ${mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
          `}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircleHeart className="w-5 h-5 text-teal-700" />
              <h2 className="font-bold text-sm text-slate-800">Conversations</h2>
            </div>
            <button
              id="close-sidebar-mobile-btn"
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-3">
            <button
              id="sidebar-new-chat-btn"
              onClick={handleCreateNewChat}
              className="w-full py-2.5 px-3.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Conversation</span>
            </button>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {sessions.length === 0 ? (
              <div className="py-8 text-center px-4">
                <p className="text-xs text-slate-400">No conversations yet.</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Start a new chat to begin speaking with MindMate.
                </p>
              </div>
            ) : (
              <>
                {/* Today */}
                {grouped.today.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1.5">
                       Today
                    </span>
                    <div className="space-y-1">
                      {grouped.today.map((s, idx) => (
                        <div
                          key={`today-${s.id}-${idx}`}
                          id={`sidebar-session-${s.id}`}
                          onClick={() => {
                            navigate(`/chat/${s.id}`);
                            setMobileSidebarOpen(false);
                          }}
                          className={`group w-full text-left p-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                            sessionId === s.id
                              ? 'bg-teal-50 text-teal-900 font-semibold border border-teal-200/80 shadow-2xs'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <span className="truncate pr-2">{s.title || 'Untitled Chat'}</span>
                          <button
                            id={`delete-session-${s.id}`}
                            onClick={(e) => handleDeleteSession(s.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition-opacity"
                            title="Delete conversation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Yesterday */}
                {grouped.yesterday.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1.5">
                      Yesterday
                    </span>
                    <div className="space-y-1">
                      {grouped.yesterday.map((s, idx) => (
                        <div
                          key={`yesterday-${s.id}-${idx}`}
                          id={`sidebar-session-${s.id}`}
                          onClick={() => {
                            navigate(`/chat/${s.id}`);
                            setMobileSidebarOpen(false);
                          }}
                          className={`group w-full text-left p-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                            sessionId === s.id
                              ? 'bg-teal-50 text-teal-900 font-semibold border border-teal-200/80 shadow-2xs'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <span className="truncate pr-2">{s.title || 'Untitled Chat'}</span>
                          <button
                            id={`delete-session-${s.id}`}
                            onClick={(e) => handleDeleteSession(s.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition-opacity"
                            title="Delete conversation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Earlier */}
                {grouped.earlier.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1.5">
                      Earlier
                    </span>
                    <div className="space-y-1">
                      {grouped.earlier.map((s, idx) => (
                        <div
                          key={`earlier-${s.id}-${idx}`}
                          id={`sidebar-session-${s.id}`}
                          onClick={() => {
                            navigate(`/chat/${s.id}`);
                            setMobileSidebarOpen(false);
                          }}
                          className={`group w-full text-left p-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                            sessionId === s.id
                              ? 'bg-teal-50 text-teal-900 font-semibold border border-teal-200/80 shadow-2xs'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <span className="truncate pr-2">{s.title || 'Untitled Chat'}</span>
                          <button
                            id={`delete-session-${s.id}`}
                            onClick={(e) => handleDeleteSession(s.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition-opacity"
                            title="Delete conversation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </aside>

        {/* Chat Main Area */}
        <main id="chat-main-area" className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Chat Header */}
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                id="open-sidebar-btn"
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-bold text-slate-900 truncate">
                  {currentSession ? currentSession.title : 'MindMate AI Companion'}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px] text-slate-500">Non-Clinical Support</span>
                </div>
              </div>
            </div>

            {/* Companion Integration in Header Corner */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div
                id="chat-header-companion"
                onClick={openBreathingExercise}
                title={`${companion.name} is ${
                  companionChatState === 'thinking'
                    ? 'reflecting'
                    : companionChatState === 'listening'
                    ? 'listening attentively'
                    : 'resting calmly'
                }. Click to breathe.`}
                className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 hover:bg-teal-50/60 border border-slate-200/80 rounded-2xl transition-all cursor-pointer shadow-2xs"
              >
                <AnimalCompanion
                  type={companionType}
                  state={companionChatState}
                  size="xs"
                  showSpeechBubble={false}
                  interactive={false}
                />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[11px] font-bold text-slate-800 leading-tight">
                    {companion.name}
                  </span>
                  <span className="text-[9px] text-teal-700 font-medium capitalize">
                    {companionChatState === 'thinking'
                      ? 'Reflecting...'
                      : companionChatState === 'listening'
                      ? 'Listening...'
                      : 'Gentle presence'}
                  </span>
                </div>
              </div>

              {currentSession && (
                <button
                  id="delete-current-chat-btn"
                  onClick={(e) => handleDeleteSession(currentSession.id, e)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete this conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Messages Stream */}
          <div id="messages-container" className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {loadingHistory ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-200 animate-spin border-t-teal-600" />
                <span className="text-xs">Loading conversation history...</span>
              </div>
            ) : messages.length === 0 ? (
              /* Empty state */
              <div id="chat-empty-state" className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto px-4 py-8">
                <div className="mb-4 flex flex-col items-center">
                  <AnimalCompanion
                    type={companionType}
                    state="idle"
                    size="lg"
                    showSpeechBubble={true}
                    customMessage="I'm right here whenever you'd like to share. Take your time."
                    interactive={true}
                  />
                </div>
                <h3 className="text-lg font-bold text-slate-900">How are you feeling today?</h3>
                <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
                  I am here to listen without judgment. Tell me what is on your mind, whether you are stressed, lonely, or simply want to talk through your day.
                </p>

                <div className="w-full space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Try asking or sharing:
                  </span>
                  {quickPrompts.map((prompt, idx) => (
                    <button
                      key={`quick-prompt-${idx}`}
                      onClick={() => handleSendMessage(prompt)}
                      className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-teal-50/80 border border-slate-200 hover:border-teal-200 text-xs text-slate-700 hover:text-teal-900 transition-colors cursor-pointer"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Message list */
              messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                const timeStr = new Date(msg.created_at).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const itemKey = `${msg.id || 'msg'}-${index}`;

                return (
                  <div
                    key={itemKey}
                    id={`chat-msg-${msg.id || index}`}
                    className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0 mt-1">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                        isUser
                          ? 'bg-teal-700 text-white rounded-br-xs shadow-xs'
                          : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/80'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      <div
                        className={`text-[10px] mt-1.5 flex items-center justify-end ${
                          isUser ? 'text-teal-200' : 'text-slate-400'
                        }`}
                      >
                        <span>{timeStr}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* AI thinking state */}
            {isSending && (
              <div id="ai-typing-indicator" className="flex items-start gap-3 justify-start animate-in fade-in">
                <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0 mt-1">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="bg-slate-100 border border-slate-200/80 rounded-2xl rounded-bl-xs px-4 py-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
                  <span className="text-xs text-slate-500 font-medium">MindMate is listening and reflecting...</span>
                </div>
              </div>
            )}

            {/* Error banner if any */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Area */}
          <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
            <div className="relative flex items-end gap-2 bg-slate-50 border border-slate-200 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-500/20 rounded-2xl p-2 transition-all">
              <textarea
                ref={textareaRef}
                id="chat-message-input"
                rows={1}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type your thoughts here... (Shift + Enter for new line)"
                disabled={isSending}
                className="flex-1 bg-transparent border-none text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none max-h-32 py-1.5 px-2"
              />

              <button
                id="chat-send-btn"
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isSending}
                className="p-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-input non-clinical disclaimer */}
            <p className="mt-2 text-[11px] text-center text-slate-400">
              MindMate is a supportive AI companion for emotional reflection, not a healthcare professional.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};
