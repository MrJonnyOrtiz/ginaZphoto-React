import { useState, useEffect } from 'react';
import CarouselIndicators from './CarouselIndicators';

const slides = [
  {
    id: 1,
    url: '/ginaZphoto.webp',
    description: "Hi! I'm Gina!",
  },
  {
    id: 2,
    url: '/gz01.webp',
    description: 'Couples Session',
  },
  {
    id: 3,
    url: '/gz02.webp',
    description: 'Event Photography',
  },
  {
    id: 4,
    url: '/gz03square.webp',
    description: 'Self Portraits',
  },
  {
    id: 5,
    url: '/gz04square.webp',
    description: 'Family Session',
  },
  {
    id: 6,
    url: '/gz05.webp',
    description: 'Family Session',
  },
  {
    id: 7,
    url: '/gz06.webp',
    description: 'Milestone Moments',
  },
  {
    id: 8,
    url: '/gz07.webp',
    description: 'Milestone Moments',
  },
];

export default function Carousel() {
  const [activeItem, setActiveItem] = useState(0);

  const nextSlide = () => {
    setActiveItem((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1,
    );
  };
  const prevSlide = () => {
    setActiveItem((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1,
    );
  };

  const goToSlide = (index) => {
    setActiveItem(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="relative mb-3 flex max-w-[1280px] justify-center gap-3 overflow-hidden sm:mt-10 md:max-h-[720px]">
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 z-[1]  -translate-y-1/2 cursor-pointer rounded-lg  p-1  pb-3 text-5xl font-bold text-black opacity-50 hover:bg-slate-300"
        >
          &lt;
        </button>
        <img
          src={slides[activeItem].url}
          alt={slides[activeItem].description}
          className=" appear aspect-square h-auto w-full object-cover transition-transform duration-1000 ease-in-out hover:scale-105 sm:object-contain"
          key={slides[activeItem].id}
        />
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 z-[1] -translate-y-1/2 cursor-pointer rounded-lg p-1  pb-3 text-5xl font-bold text-black opacity-50 hover:bg-slate-300"
        >
          &gt;
        </button>
      </div>
      <p className="my-3 text-center text-xl">
        {slides[activeItem].description}
      </p>
      <CarouselIndicators
        slides={slides}
        activeItem={activeItem}
        onClick={goToSlide}
      />
    </>
  );
}
