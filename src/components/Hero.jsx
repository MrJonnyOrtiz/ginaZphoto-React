import { useState, useEffect } from 'react';
import config from '../config';

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % config.heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {config.heroImages.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${config.siteName} hero ${i + 1}`}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-center text-white">
        <h1 className="text-4xl font-semibold md:text-6xl">
          {config.siteName}
        </h1>
        <p className="mt-4 text-lg md:text-2xl">{config.tagline}</p>
        <p className="mt-2 text-base md:text-lg">{config.location}</p>
        <a
          href={config.ctaLink}
          className="bg-primary text-text mt-8 rounded-md px-8 py-3 font-semibold transition-transform hover:scale-105"
        >
          {config.ctaText}
        </a>
      </div>
    </section>
  );
}
