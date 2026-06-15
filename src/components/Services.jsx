import config from '../config';
import useFadeIn from '../hooks/useFadeIn';

export default function Services() {
  const ref = useFadeIn();

  return (
    <section id="services" ref={ref} className="fade-in px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-semibold">Services</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {config.services.map((service) => (
            <div
              key={service.name}
              className="border-primary/30 hover:border-primary rounded-lg border p-6 transition-colors hover:shadow-md"
            >
              <h3 className="text-xl font-semibold">{service.name}</h3>
              <p className="mt-2 text-base opacity-80">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
