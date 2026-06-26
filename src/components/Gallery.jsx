import { useState, useEffect, lazy, Suspense } from 'react';
import config from '../config';
import useFadeIn from '../hooks/useFadeIn';

const Lightbox = lazy(() => import('./Lightbox'));

export default function Gallery() {
  const ref = useFadeIn();
  const [images, setImages] = useState(config.portfolio);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchGallery = () => {
      fetch('/gallery.json')
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data) => { if (data.length > 0) setImages(data); })
        .catch(() => {});
    };
    fetchGallery();
    const onVisible = () => { if (!document.hidden) fetchGallery(); };
    const onPageShow = (e) => { if (e.persisted) fetchGallery(); };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('pageshow', onPageShow);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  const filteredImages =
    activeCategory === 'All'
      ? images
      : images.filter((img) => img.category === activeCategory);

  return (
    <section id="portfolio" ref={ref} className="fade-in px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 text-center text-3xl font-semibold">
          {config.portfolioHeading}
        </h2>

        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {config.portfolioCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2 text-base font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-text'
                  : 'border-primary/50 text-text hover:bg-primary/20 border bg-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
          {filteredImages.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setLightboxIndex(i)}
              className="focus:ring-primary mb-4 block w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2"
            >
              <img
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                loading="lazy"
                className="w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Suspense fallback={null}>
          <Lightbox
            images={filteredImages}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        </Suspense>
      )}
    </section>
  );
}
