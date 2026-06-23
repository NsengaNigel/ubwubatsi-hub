import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Navbar from '../components/Navbar';
import api from '../api/axios';

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso) {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return 'Today';
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

export default function Messages() {
  const { user } = useAuth();
  const socket = useSocket();
  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [mobileView, setMobileView] = useState('list');
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get('/api/messages/conversations')
      .then(res => setConversations(res.data))
      .catch(() => {})
      .finally(() => setLoadingConvos(false));
  }, []);

  useEffect(() => {
    if (location.state?.conversationId) {
      setActiveId(location.state.conversationId);
      setMobileView('thread');
    }
  }, [location.state]);

  useEffect(() => {
    if (!activeId) return;
    setLoadingMsgs(true);
    api.get(`/api/messages/${activeId}`)
      .then(res => setMessages(res.data))
      .catch(() => {})
      .finally(() => setLoadingMsgs(false));
  }, [activeId]);

  useEffect(() => {
    if (!socket || !activeId) return;
    socket.emit('join_conversation', activeId);

    const handleReceive = (msg) => {
      if (msg.conversationId === activeId) {
        setMessages(prev => [...prev, msg]);
      }
      setConversations(prev =>
        prev.map(c =>
          c._id === msg.conversationId
            ? { ...c, lastMessage: msg.content, lastMessageAt: msg.createdAt }
            : c
        )
      );
    };

    socket.on('receive_message', handleReceive);
    return () => socket.off('receive_message', handleReceive);
  }, [socket, activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getOtherParticipant = (convo) => {
    return convo.participants?.find(p => p._id !== user.id) || convo.participants?.[0];
  };

  const handleSelectConversation = (convoId) => {
    setActiveId(convoId);
    setMobileView('thread');
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeId || sending) return;
    setSending(true);
    try {
      const { data: msg } = await api.post(`/api/messages/${activeId}`, { content: text.trim() });
      socket?.emit('send_message', { ...msg, conversationId: activeId });
      setText('');
    } catch {
      // silently fail
    } finally {
      setSending(false);
    }
  };

  const activeConvo = conversations.find(c => c._id === activeId);
  const otherUser = activeConvo ? getOtherParticipant(activeConvo) : null;

  return (
    <div className="bg-[#fff8f5] text-[#1e1b18] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-0 md:px-10 py-0 md:py-6 flex gap-4 md:h-[calc(100vh-80px)]">

        {/* Conversations list — shown on mobile when mobileView=list, always on md+ */}
        <div className={`${mobileView === 'list' ? 'flex' : 'hidden'} md:flex w-full md:w-80 flex-shrink-0 border-b md:border border-[#dcc1b5] md:rounded-2xl bg-white overflow-hidden flex-col`}>
          <div className="px-5 py-4 border-b border-[#dcc1b5]">
            <h2 style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '18px', fontWeight: 600, color: '#1e1b18' }}>
              Messages
            </h2>
          </div>

          {loadingConvos ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#dcc1b5] border-t-[#99420d] rounded-full animate-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 px-5 text-center">
              <span className="material-symbols-outlined text-[#dcc1b5]" style={{ fontSize: '40px' }}>chat</span>
              <p className="text-sm text-[#56433a]">No conversations yet.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {conversations.map(convo => {
                const other = getOtherParticipant(convo);
                const isActive = convo._id === activeId;
                return (
                  <button
                    key={convo._id}
                    onClick={() => handleSelectConversation(convo._id)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 border-b border-[#f3e8e4] transition-colors min-h-[64px] ${
                      isActive ? 'bg-[#fff0e8]' : 'hover:bg-[#fdf5f2]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#efe6e2] flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-[#99420d]">{getInitials(other?.fullName)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm font-semibold text-[#1e1b18] truncate">{other?.fullName || 'User'}</span>
                        <span className="text-xs text-[#56433a] flex-shrink-0 ml-2">
                          {convo.lastMessageAt ? formatDate(convo.lastMessageAt) : ''}
                        </span>
                      </div>
                      <p className="text-xs text-[#56433a] truncate mt-0.5">{convo.lastMessage || 'Start a conversation'}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Message thread — shown on mobile when mobileView=thread, always on md+ */}
        <div className={`${mobileView === 'thread' ? 'flex' : 'hidden'} md:flex flex-1 border border-[#dcc1b5] md:rounded-2xl bg-white overflow-hidden flex-col`}>
          {!activeId ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
              <span className="material-symbols-outlined text-[#dcc1b5]" style={{ fontSize: '56px' }}>forum</span>
              <p className="text-base text-[#56433a]">Select a conversation to start messaging</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-4 md:px-5 py-4 border-b border-[#dcc1b5] flex items-center gap-3">
                {/* Back button — mobile only */}
                <button
                  className="flex md:hidden items-center justify-center min-h-[44px] min-w-[44px] text-[#56433a] hover:text-[#99420d] transition-colors -ml-2"
                  onClick={() => setMobileView('list')}
                  aria-label="Back to conversations"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="w-9 h-9 rounded-full bg-[#efe6e2] flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-[#99420d]">{getInitials(otherUser?.fullName)}</span>
                </div>
                <div>
                  <p style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '16px', fontWeight: 600, color: '#1e1b18' }}>
                    {otherUser?.fullName || 'User'}
                  </p>
                  <p className="text-xs text-[#56433a]">{otherUser?.email}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 md:px-5 py-4 flex flex-col gap-3">
                {loadingMsgs ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-[#dcc1b5] border-t-[#99420d] rounded-full animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center mt-20">
                    <span className="material-symbols-outlined text-[#dcc1b5]" style={{ fontSize: '40px' }}>chat_bubble</span>
                    <p className="text-sm text-[#56433a]">No messages yet. Say hello!</p>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMine = msg.senderId === user.id || msg.senderId?._id === user.id;
                    return (
                      <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[80%] md:max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isMine
                              ? 'bg-[#99420d] text-white rounded-br-sm'
                              : 'bg-[#f3e8e4] text-[#1e1b18] rounded-bl-sm'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${isMine ? 'text-[#f9c9b3]' : 'text-[#56433a]'}`}>
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="px-4 md:px-5 py-3 border-t border-[#dcc1b5] flex gap-2 md:gap-3">
                <input
                  type="text"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#dcc1b5] bg-[#fff8f5] text-sm text-[#1e1b18] placeholder-[#a08070] focus:outline-none focus:border-[#99420d] transition-colors min-h-[44px]"
                />
                <button
                  type="submit"
                  disabled={!text.trim() || sending}
                  className="px-4 md:px-5 py-2.5 bg-[#99420d] text-white text-sm font-semibold rounded-xl hover:bg-[#7a3409] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 min-h-[44px]"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>send</span>
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
