import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Lightbox({ images, startIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const closeRef = useRef(null);
  const previousFocusRef = useRef(null);

  const prev = () => setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  useEffect(() => {
    previousFocusRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="relative flex items-center gap-4">
        <button
          onClick={prev}
          aria-label="Previous image"
          className="text-4xl text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary rounded p-2"
        >
          ‹
        </button>

        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />

        <button
          onClick={next}
          aria-label="Next image"
          className="text-4xl text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary rounded p-2"
        >
          ›
        </button>
      </div>

      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Close lightbox"
        className="absolute top-6 right-6 text-3xl text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary rounded p-2"
      >
        ✕
      </button>

      <p className="absolute bottom-6 text-sm text-white/70">
        {currentIndex + 1} of {images.length}
      </p>
    </div>,
    document.body
  );
}
