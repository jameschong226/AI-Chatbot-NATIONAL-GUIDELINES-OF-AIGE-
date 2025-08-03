import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/80 backdrop-blur-sm p-4 border-b border-gray-700 shadow-lg sticky top-0 z-10">
      <h1 className="text-2xl font-bold text-center text-white">
        <span className="text-blue-400">AIGE</span> Expert
      </h1>
      <p className="text-center text-gray-400 text-sm">Your Knowledge Base Assistant</p>
    </header>
  );
};

export default Header;