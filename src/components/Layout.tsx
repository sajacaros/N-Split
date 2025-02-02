import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-gray-800">
            N-Split
          </Link>
          <nav>
            <Link to="/" className="text-gray-600 hover:text-gray-800">
              대시보드
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-md mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-center text-gray-600">
            © 2025 N-Split. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
