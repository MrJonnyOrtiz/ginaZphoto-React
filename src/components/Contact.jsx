import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import config from '../config';
import useFadeIn from '../hooks/useFadeIn';

export default function Contact() {
  const ref = useFadeIn();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasCaptchaToken, setHasCaptchaToken] = useState(false);
  const captchaRef = useRef(null);

  const setField = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[A-Za-z'.]+\s[A-Za-z'.]+/.test(formData.name)) {
      return setErrorMessage('Please enter a valid full name.');
    }
    if (formData.message.length < 4) {
      return setErrorMessage('Please enter a valid message.');
    }
    if (!hasCaptchaToken) {
      return setErrorMessage('Please check the reCAPTCHA box.');
    }

    setStatus('submitting');
    setErrorMessage('');
    const token = captchaRef.current.getValue();
    captchaRef.current.reset();

    try {
      const res = await fetch(import.meta.env.VITE_CONTACT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, 'g-recaptcha-response': token }),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setHasCaptchaToken(false);
      } else {
        setStatus('error');
        setErrorMessage('Something went wrong. Please try again later.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <section id="contact" ref={ref} className="fade-in px-6 py-20">
      <div className="mx-auto max-w-lg">
        <h2 className="mb-8 text-center text-3xl font-semibold">Contact</h2>

        {config.phone && (
          <p className="mb-6 text-center">
            Call or text:{' '}
            <a
              href={`tel:${config.phone}`}
              className="hover:text-primary underline"
            >
              {config.phone.replace(
                /(\d)(\d{3})(\d{3})(\d{4})/,
                '+$1 ($2) $3-$4',
              )}
            </a>
          </p>
        )}

        {status === 'success' && (
          <p className="mb-4 text-center font-semibold text-green-600">
            Your message was sent!
          </p>
        )}
        {errorMessage && (
          <p
            className="mb-4 text-center font-semibold text-red-600"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-base font-medium">Full Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={setField('name')}
              autoComplete="name"
              required
              className="border-primary/40 text-text focus:border-primary mt-1 w-full rounded border px-4 py-2 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-base font-medium">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={setField('email')}
              autoComplete="email"
              required
              className="border-primary/40 text-text focus:border-primary mt-1 w-full rounded border px-4 py-2 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-base font-medium">Message</span>
            <textarea
              name="message"
              value={formData.message}
              onChange={setField('message')}
              rows="4"
              required
              className="border-primary/40 text-text focus:border-primary mt-1 w-full rounded border px-4 py-2 focus:outline-none"
            />
          </label>

          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              ref={captchaRef}
              onChange={() => {
                setHasCaptchaToken(true);
                setErrorMessage('');
              }}
            />
          </div>

          {hasCaptchaToken && (
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="bg-primary text-text hover:bg-primary/80 w-full rounded py-3 font-semibold transition-colors disabled:opacity-50"
            >
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>
          )}
        </form>
      </div>
    </section>
  );
}
