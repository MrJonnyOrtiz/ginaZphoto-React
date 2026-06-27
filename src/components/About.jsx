import { useState, useEffect } from 'react';
import config from '../config';
import useFadeIn from '../hooks/useFadeIn';

const API = 'https://xzubixmkng.execute-api.us-east-1.amazonaws.com';

export default function About() {
  const ref = useFadeIn();
  const [portrait, setPortrait] = useState(config.portrait);

  useEffect(() => {
    fetch(`${API}/portrait`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setPortrait(data.src + '?t=' + Date.now()))
      .catch(() => {});
  }, []);

  return (
    <section id="about" ref={ref} className="fade-in py-20 px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-center text-3xl font-semibold">About</h2>
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <img
            src={portrait}
            alt={`${config.siteName} portrait`}
            loading="lazy"
            className="w-full rounded-lg object-cover"
          />
          <div>
            <p className="text-lg leading-relaxed">{config.bio}</p>
            <div className="mt-6 flex gap-4">
              {config.facebook && (
                <a href={config.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                  <img src="/fb.png" alt="Facebook" className="h-8 w-8" />
                </a>
              )}
              {config.instagram && (
                <a href={config.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                  <img src="/insta.png" alt="Instagram" className="h-8 w-8" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
