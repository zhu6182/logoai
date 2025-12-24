
import React from 'react';

interface LogoCardProps {
  url: string;
  onClick: () => void;
  onEdit: () => void;
}

const LogoCard: React.FC<LogoCardProps> = ({ url, onClick, onEdit }) => {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div 
        className="aspect-square cursor-zoom-in overflow-hidden bg-gray-50 flex items-center justify-center p-4"
        onClick={onClick}
      >
        <img 
          src={url} 
          alt="生成的 Logo" 
          className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
        <button 
          onClick={onClick}
          className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          title="放大预览"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-3 bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors shadow-lg text-white"
          title="AI 二次编辑"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LogoCard;
