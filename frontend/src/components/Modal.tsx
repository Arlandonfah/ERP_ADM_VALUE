import React, { ReactNode, useEffect } from 'react';

type ModalProps = {
  children: ReactNode;
  isOpen?: boolean;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ children, isOpen = true, onClose }) => {
 
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);


  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay avec flou */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Conteneur du modal avec animations et bordure en dégradé */}
        <div 
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 md:mx-auto z-50 overflow-hidden animate-modalEntry"
          onClick={(e) => e.stopPropagation()}
          style={{
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }}
        >
          {/* Bordure en dégradé */}
          <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 -z-10"></div>
          
          {/* Bouton de fermeture */}
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
            aria-label="Fermer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Contenu du modal */}
          <div className="bg-white p-1 rounded-xl">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;