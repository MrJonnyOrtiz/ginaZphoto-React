import config from '../config';

export default function Footer() {
  return (
    <footer className="border-t border-primary/30 py-10 text-center">
      <div className="mb-4 flex justify-center gap-4">
        {config.facebook && (
          <a href={config.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
            <img src="/fb.png" alt="Facebook" className="h-6 w-6" />
          </a>
        )}
        {config.instagram && (
          <a href={config.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
            <img src="/insta.png" alt="Instagram" className="h-6 w-6" />
          </a>
        )}
      </div>

      {config.privacyPolicyUrl && (
        <p className="mb-2">
          <a href={config.privacyPolicyUrl} className="text-sm underline hover:text-primary">
            Privacy Policy
          </a>
        </p>
      )}

      <p className="text-sm opacity-70">
        &copy; {new Date().getFullYear()} {config.siteName}. Powered by{' '}
        <a href={config.footerCreditUrl} target="_blank" rel="noreferrer" className="underline hover:text-primary">
          {config.footerCredit}
        </a>
      </p>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className="mt-4 text-2xl opacity-50 transition-opacity hover:opacity-100"
      >
        ↑
      </button>
    </footer>
  );
}
