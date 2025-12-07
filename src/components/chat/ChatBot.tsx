import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { apiService, ChatMessage, ChatSession, SendMessageData, SendMessageResponse } from '@/context/ApiService';
import { Loader2 } from 'lucide-react';

// Local component interface
interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('new');
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat session when component mounts or opens
  useEffect(() => {
    if (isOpen) {
      loadChatSession();
    }
  }, [isOpen]);

  // Load unread count when chatbot is closed
  useEffect(() => {
    if (!isOpen && sessionId !== 'new') {
      loadUnreadCount();
    }
  }, [isOpen, sessionId]);

  // Convert API ChatMessage to local Message format
  const convertToLocalMessage = (apiMessage: ChatMessage): Message => {
    return {
      id: apiMessage.id,
      text: apiMessage.message,
      isBot: apiMessage.sender === 'bot',
      timestamp: new Date(apiMessage.timestamp || apiMessage.createdAt),
    };
  };

  // Load chat session data
  const loadChatSession = async () => {
    try {
      setIsLoading(true);
      
      // Get or create chat session
      const session = await apiService.getChatSession(sessionId);
      
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
        console.log('Unread count response:', response);
        
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
      messages: [] as Message[] 
    };
    
    console.log('🔍 Extracting bot response from:', response);
    
    // Structure 1: Check for botMessage in data property
    if (response.success && response.data?.botMessage) {
      console.log('✅ Found botMessage in response.data');
      result.text = response.data.botMessage.message;
      result.messages = [convertToLocalMessage(response.data.botMessage)];
    }
    // Structure 2: Check for messages array in data property
    else if (response.success && response.data?.messages) {
      console.log('✅ Found messages array in response.data');
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
      console.log('✅ Found botMessage directly on response');
      result.text = response.botMessage.message;
      result.messages = [convertToLocalMessage(response.botMessage)];
    }
    // Structure 4: Direct messages array property
    else if (response.messages) {
      console.log('✅ Found messages array directly on response');
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
      console.log('✅ Found message property');
      result.text = response.message;
    }
    // Structure 6: success with no data (empty response)
    else if (response.success) {
      console.log('✅ Success response with no data');
      result.text = "Thank you for your message! How else can I help you?";
    }
    // Fallback
    else {
      console.log('⚠️ No bot response found, using fallback');
      result.text = "I've received your message. How can I assist you further?";
    }
    
    console.log('📤 Extracted result:', result);
    return result;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Create user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
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
        message: inputValue,
        metadata: {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          platform: 'web',
        }
      };

      console.log('📤 Sending message to API:', messageData);
      
      // Send message to API
      const response: SendMessageResponse = await apiService.sendChatMessage(messageData);
      
      console.log('📥 Received API response:', response);
      
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
      
      // Load a fresh session
      await loadChatSession();
      
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  // Debug function to log current state
  const debugState = () => {
    console.log('🤖 ChatBot State:', {
      isOpen,
      sessionId,
      unreadCount,
      messagesCount: messages.length,
      isLoading,
      lastMessages: messages.slice(-2),
      hasToken: !!localStorage.getItem('token') || !!sessionStorage.getItem('token')
    });
  };

  // Test API connection
  const testApiConnection = async () => {
    try {
      console.log('🔌 Testing API connection...');
      const session = await apiService.getChatSession('test');
      console.log('✅ API Connection successful:', session);
      return true;
    } catch (error) {
      console.error('❌ API Connection failed:', error);
      return false;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-background border border-border rounded-lg shadow-lg overflow-hidden mb-2">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <span className="font-medium">Chat Support</span>
                {sessionId !== 'new' && (
                  <span 
                    className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full cursor-help"
                    title={`Session ID: ${sessionId}`}
                  >
                    ID: {sessionId.substring(0, 8)}...
                  </span>
                )}
                {unreadCount > 0 && (
                  <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
              )}
              <button
                type="button"
                className="h-8 w-8 flex items-center justify-center text-primary-foreground hover:bg-primary/80 rounded-full transition-colors"
                onClick={() => setIsOpen(false)}
                title="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="h-72 p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No messages yet. Start a conversation!</p>
                  <button
                    onClick={testApiConnection}
                    className="mt-2 text-xs text-blue-500 hover:text-blue-600"
                  >
                    Test API Connection
                  </button>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`flex max-w-[80%] gap-2 ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                        message.isBot ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {message.isBot ? (
                          <Bot className="h-3 w-3" />
                        ) : (
                          <User className="h-3 w-3" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div
                          className={`px-3 py-2 rounded-lg text-sm break-words whitespace-pre-wrap ${
                            message.isBot
                              ? 'bg-muted text-muted-foreground'
                              : 'bg-primary text-primary-foreground'
                          }`}
                        >
                          {message.text}
                        </div>
                        <span className={`text-xs text-muted-foreground mt-1 ${message.isBot ? 'text-left' : 'text-right'}`}>
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs text-muted-foreground">
                {messages.length > 0 && (
                  <span>{messages.length} message{messages.length !== 1 ? 's' : ''}</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={debugState}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-border"
                  title="Debug state"
                >
                  Debug
                </button>
                <button 
                  onClick={handleClearChat}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-border"
                  title="Start new chat"
                >
                  New Chat
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                title="Send message"
                className="flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground text-center">
              Press <kbd className="px-1 py-0.5 bg-muted rounded">Enter</kbd> to send
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <div className="relative">
        {unreadCount > 0 && !isOpen && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg relative hover:scale-105 transition-transform duration-200 bg-primary hover:bg-primary/90"
          onClick={() => setIsOpen(!isOpen)}
          title={isOpen ? "Close chat" : "Open chat"}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <>
              <MessageCircle className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                </span>
              )}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatBot;