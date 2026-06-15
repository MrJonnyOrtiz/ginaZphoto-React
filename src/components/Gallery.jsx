import { useState, lazy, Suspense } from 'react';
import config from '../config';
import useFadeIn from '../hooks/useFadeIn';

const Lightbox = lazy(() => import('./Lightbox'));

export default function Gallery() {
  const ref = useFadeIn();
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filteredImages =
    activeCategory === 'All'
      ? config.portfolio
      : config.portfolio.filter((img) => img.category === activeCategory);

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

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredImages.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setLightboxIndex(i)}
              className="focus:ring-primary overflow-hidden rounded-lg focus:outline-none focus:ring-2"
            >
              <img
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                loading="lazy"
                className="aspect-[3/2] w-full object-cover transition-transform duration-300 hover:scale-105"
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
