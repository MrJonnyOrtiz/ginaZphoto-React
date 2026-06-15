import { lazy, Suspense } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import config from './config';
import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Gallery from './components/Gallery';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': config.schemaType,
    name: config.siteName,
    description: config.metaDescription,
    url: config.metaUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: config.schemaCity,
      addressRegion: config.schemaState,
    },
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>{config.metaTitle}</title>
        <meta name="description" content={config.metaDescription} />
        <link rel="canonical" href={config.metaUrl} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={config.googleFontUrl} rel="stylesheet" />
        <meta property="og:title" content={config.metaTitle} />
        <meta property="og:description" content={config.metaDescription} />
        <meta property="og:image" content={config.ogImage} />
        <meta property="og:url" content={config.metaUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={config.metaTitle} />
        <meta name="twitter:description" content={config.metaDescription} />
        <meta name="twitter:image" content={config.ogImage} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div
        style={{
          '--color-primary': config.primaryColor,
          '--color-background': config.backgroundColor,
          '--color-text': config.textColor,
          '--font-display': config.fontFamily,
        }}
      >
        <Navbar />
        <main>
          <Hero />
          <Services />
          {config.showPortfolio !== false && <Gallery />}
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}

export default App;
