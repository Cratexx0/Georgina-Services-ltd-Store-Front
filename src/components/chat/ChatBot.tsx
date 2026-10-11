import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Loader2, SquarePen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { apiService, ChatMessage, ChatSession, SendMessageData, SendMessageResponse } from '@/context/ApiService';
import { cn } from '@/lib/utils';

// Local component interface
interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

// Suggested first messages shown on a fresh chat (edit freely)
const quickReplies = ['Where is my order?', 'Delivery information', 'Cleaning services'];

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('new');
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load chat session when component mounts or opens
  useEffect(() => {
    if (isOpen) {
      loadChatSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Load unread count when chatbot is closed
  useEffect(() => {
    if (!isOpen && sessionId !== 'new') {
      loadUnreadCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, sessionId]);

  // Close the chat with Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // Keep the input focused (it is disabled while a request is in flight)
  useEffect(() => {
    if (isOpen && !isLoading) {
      inputRef.current?.focus();
    }
  }, [isOpen, isLoading]);

  // Convert API ChatMessage to local Message format
  const convertToLocalMessage = (apiMessage: ChatMessage): Message => {
    return {
      id: apiMessage.id,
      text: apiMessage.message,
      isBot: apiMessage.sender === 'bot',
      timestamp: new Date(apiMessage.timestamp || apiMessage.createdAt),
    };
  };

  // Load chat session data (optionally for a specific session id)
  const loadChatSession = async (id: string = sessionId) => {
    try {
      setIsLoading(true);

      // Get or create chat session
      const session = await apiService.getChatSession(id);

      // Handle different response structures
      let sessionData: ChatSession;
      let sessionMessages: ChatMessage[] = [];

      // Check for data property (wrapped response)
      if ('data' in session && session.data) {
        sessionData = session.data;
      } else {
        sessionData = session;
      }

      // Extract messages from session data
      if (sessionData.messages && Array.isArray(sessionData.messages)) {
        sessionMessages = sessionData.messages;
      } else if (sessionData.data?.messages && Array.isArray(sessionData.data.messages)) {
        sessionMessages = sessionData.data.messages;
      }

      // Update session ID if provided and valid
      if (sessionData.sessionId && sessionData.sessionId !== 'new') {
        setSessionId(sessionData.sessionId);
      }

      // Convert API messages to local format
      const localMessages = sessionMessages.map(convertToLocalMessage);

      // If no messages exist, show welcome message
      if (localMessages.length === 0) {
        setMessages([
          {
            id: 'welcome-1',
            text: 'Hello! How can I help you today?',
            isBot: true,
            timestamp: new Date(),
          },
        ]);
      } else {
        setMessages(localMessages);
      }

      // Mark session as read if we have unread messages
      const hasUnreadMessages = sessionMessages.some(msg => !msg.isRead && msg.sender === 'bot');
      if (hasUnreadMessages && sessionData.sessionId) {
        try {
          await apiService.markChatAsRead(sessionData.sessionId);
        } catch (error) {
          console.error('Error marking chat as read:', error);
        }
      }
    } catch (error) {
      console.error('Error loading chat session:', error);

      // Initialize with welcome message if no session exists
      if (messages.length === 0) {
        setMessages([
          {
            id: 'fallback-1',
            text: 'Hello! How can I help you today?',
            isBot: true,
            timestamp: new Date(),
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      if (sessionId !== 'new') {
        const response = await apiService.getUnreadChatCount(sessionId);

        // Handle response - could be direct object or wrapped
        // The API returns { unreadCount: number } directly or wrapped in data

        let unreadCountValue = 0;

        if (typeof response === 'object' && response !== null) {
          // Check if response has data property (wrapped response)
          if ('data' in response && response.data && typeof response.data === 'object') {
            const data = response.data as any;
            if ('unreadCount' in data && typeof data.unreadCount === 'number') {
              unreadCountValue = data.unreadCount;
            }
          }
          // Check if unreadCount is directly on response
          else if ('unreadCount' in response && typeof (response as any).unreadCount === 'number') {
            unreadCountValue = (response as any).unreadCount;
          }
        }

        setUnreadCount(unreadCountValue);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
      setUnreadCount(0);
    }
  };

  // Helper function to extract bot response from API response
  const extractBotResponse = (response: SendMessageResponse): {
    text: string;
    messages: Message[];
  } => {
    // Default fallback
    const result = {
      text: '',
      messages: [] as Message[],
    };

    // Structure 1: Check for botMessage in data property
    if (response.success && response.data?.botMessage) {
      result.text = response.data.botMessage.message;
      result.messages = [convertToLocalMessage(response.data.botMessage)];
    }
    // Structure 2: Check for messages array in data property
    else if (response.success && response.data?.messages) {
      const botMessages = response.data.messages
        .filter(msg => msg.sender === 'bot')
        .map(convertToLocalMessage);
      result.messages = botMessages;
      if (botMessages.length > 0) {
        result.text = botMessages.map(m => m.text).join('\n');
      }
    }
    // Structure 3: Direct botMessage property
    else if (response.botMessage) {
      result.text = response.botMessage.message;
      result.messages = [convertToLocalMessage(response.botMessage)];
    }
    // Structure 4: Direct messages array property
    else if (response.messages) {
      const botMessages = response.messages
        .filter(msg => msg.sender === 'bot')
        .map(convertToLocalMessage);
      result.messages = botMessages;
      if (botMessages.length > 0) {
        result.text = botMessages.map(m => m.text).join('\n');
      }
    }
    // Structure 5: Simple message property
    else if (response.message) {
      result.text = response.message;
    }
    // Structure 6: success with no data (empty response)
    else if (response.success) {
      result.text = 'Thank you for your message! How else can I help you?';
    }
    // Fallback
    else {
      result.text = "I've received your message. How can I assist you further?";
    }

    return result;
  };

  // Sends the typed message, or `override` when a quick reply is tapped
  const handleSendMessage = async (override?: string) => {
    const text = (override ?? inputValue).trim();
    if (!text || isLoading) return;

    // Create user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      isBot: false,
      timestamp: new Date(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Prepare data for API
      const messageData: SendMessageData = {
        sessionId,
        message: text,
        metadata: {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          platform: 'web',
        },
      };

      // Send message to API
      const response: SendMessageResponse = await apiService.sendChatMessage(messageData);

      // Extract bot response from the API response
      const { text: botResponseText, messages: newBotMessages } = extractBotResponse(response);

      // Add bot response(s)
      if (newBotMessages && newBotMessages.length > 0) {
        // Add all bot messages from the response
        setMessages(prev => [...prev, ...newBotMessages]);
      } else if (botResponseText) {
        // Add single bot message
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          text: botResponseText,
          isBot: true,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
      }

      // After sending message, refresh the session to get updated session ID if it changed
      await loadChatSession();
    } catch (error) {
      console.error('❌ Error sending message:', error);

      // Fallback error response
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Clear chat session and start fresh
  const handleClearChat = async () => {
    try {
      // Reset to new session
      setSessionId('new');
      setUnreadCount(0);

      // Set welcome message
      setMessages([
        {
          id: 'welcome-1',
          text: 'Hello! How can I help you today?',
          isBot: true,
          timestamp: new Date(),
        },
      ]);

      // Load a fresh session (pass 'new' explicitly - state has not updated yet)
      await loadChatSession('new');
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  // Show suggestions only on a fresh chat (just the welcome message)
  const showQuickReplies =
    !isLoading && messages.length === 1 && messages[0].isBot;

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {/* Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Chat support"
          className="absolute bottom-[4.5rem] right-0 mb-1 flex h-[min(34rem,calc(100dvh-8rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 motion-reduce:animate-none sm:w-96"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-foreground/15"
                title={sessionId !== 'new' ? `Session ID: ${sessionId}` : undefined}
              >
                <Bot className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium leading-tight">Chat support</p>
                <p className="truncate text-xs text-primary-foreground/75">
                  Ask about orders, products or services
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-primary-foreground/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
                onClick={handleClearChat}
                title="Start new chat"
                aria-label="Start new chat"
              >
                <SquarePen className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-primary-foreground/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="min-h-0 flex-1">
            <div
              role="log"
              aria-live="polite"
              aria-label="Conversation"
              className="space-y-1 p-4"
            >
              {messages.map((message, index) => {
                const prev = messages[index - 1];
                const next = messages[index + 1];
                const isFirstInGroup = !prev || prev.isBot !== message.isBot;
                const isLastInGroup = !next || next.isBot !== message.isBot;

                return (
                  <div
                    key={message.id}
                    className={cn(
                      'flex items-end gap-2',
                      message.isBot ? 'justify-start' : 'justify-end',
                      isFirstInGroup && index > 0 && 'pt-3'
                    )}
                  >
                    {message.isBot && (
                      <div className="h-7 w-7 flex-shrink-0">
                        {isLastInGroup && (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Bot className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    )}
                    <div
                      className={cn(
                        'flex max-w-[78%] flex-col',
                        message.isBot ? 'items-start' : 'items-end'
                      )}
                    >
                      <div
                        className={cn(
                          'whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
                          message.isBot
                            ? 'bg-muted text-foreground'
                            : 'bg-primary text-primary-foreground',
                          isLastInGroup && (message.isBot ? 'rounded-bl-md' : 'rounded-br-md')
                        )}
                      >
                        {message.text}
                      </div>
                      {isLastInGroup && (
                        <span className="mt-1 text-[11px] text-muted-foreground">
                          {formatTime(message.timestamp)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-end gap-2 pt-3" aria-label="Support is typing">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 motion-reduce:animate-pulse"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quick replies */}
              {showQuickReplies && (
                <div className="flex flex-wrap gap-2 pt-3">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      type="button"
                      onClick={() => handleSendMessage(reply)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <form
            className="flex items-center gap-2 border-t border-border bg-background p-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message…"
              aria-label="Message"
              className="flex-1 rounded-full"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send message"
              title="Send message"
              className="h-10 w-10 flex-shrink-0 rounded-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <div className="relative">
        {unreadCount > 0 && !isOpen && (
          <div
            className="absolute -right-1 -top-1 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white"
            aria-label={`${unreadCount} unread ${unreadCount === 1 ? 'message' : 'messages'}`}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
        <Button
          size="icon"
          className="h-14 w-14 rounded-full bg-primary shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-primary/90 motion-reduce:transition-none motion-reduce:hover:scale-100"
          onClick={() => setIsOpen(!isOpen)}
          title={isOpen ? 'Close chat' : 'Open chat'}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>
    </div>
  );
};

export default ChatBot;