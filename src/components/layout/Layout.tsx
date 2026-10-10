import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ChatBot from '../chat/ChatBot';
import BackToTop from './BackToTop';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow animate-fade-in">
        {children}
      </main>
      <Footer />
      <BackToTop />
      <ChatBot />
    </div>
  );
};

export default Layout;
