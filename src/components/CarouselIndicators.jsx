export default function CarouselIndicators({ slides, activeItem, onClick }) {
  return (
    <div className="mb-3 flex justify-center gap-1 p-2">
      {slides.map((_, index) => (
        <div
          key={index}
          className={`h-3 w-3 cursor-pointer rounded-full ${
            index === activeItem ? 'bg-black' : 'bg-[#E9C18D]'
          }`}
          onClick={() => onClick(index)}
        ></div>
      ))}
    </div>
  );
}
