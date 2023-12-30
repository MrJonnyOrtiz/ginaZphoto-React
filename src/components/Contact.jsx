import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

function Contact() {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [hasCaptchaToken, setHasCaptchaToken] = useState(false);

  const SECRET_KEY = '6LdYBxgdAAAAALsuzUelSW-rZlbD4e-y5XNLlmKq';

  const captchaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = Object.fromEntries(new FormData(e.target).entries());

    // data validation
    const fullNameRegX =
      /([A-Z]+([']|[\.])?([A-Z,a-z,\.]*))\s(([A-Z]|['])+[A-Z,a-z]*)([-\s](([A-Z]|['])+[A-Z,a-z]*)*)?/g;

    if (fullNameRegX.test(formDataObj.name)) {
      // setError("");
      if (formDataObj.message.length > 3) {
        // setError("");
        if (hasCaptchaToken) {
          const token = captchaRef.current.getValue(); // returns token from ReCaptcha component

          captchaRef.current.reset();

          const raw = JSON.stringify({
            ...formDataObj,
            'g-recaptcha-response': token,
          });

          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: raw,
          };

          try {
            const response = await fetch(
              'https://6bdqrjta4g.execute-api.us-east-1.amazonaws.com/Prod',
              options,
            );

            if (response.ok) {
              // show success message
              setSuccess('Your message was sent!');
              setError('');

              // reset form
              setFullName('');
              setEmail('');
              setMessage('');
              setHasCaptchaToken(false);

              // const data = await response.json(); // the data is a message Id string, good for nothing
            } else {
              // show error message
              setError(
                'Sorry, something went wrong trying to send your message. The administrator has been informed. Please try again at a later time.',
              );
              console.log(response);
            }
          } catch (error) {
            setError(
              'Sorry, something went wrong trying to send your message. The administrator has been informed. Please try again at a later time.',
            );
          }
        } else {
          // the recaptcha was not checked
          setError('Please check the recaptcha box.');
        }
      } else {
        setError('Please enter a valid message.');
      }
    } else {
      setError('Please enter a valid full name.');
    }
  };

  function handleOnChange(value) {
    setHasCaptchaToken(true);
    setError('');
  }

  return (
    <div
      id="contact"
      className="md:text-md mx-auto my-5 grid max-w-xs grid-cols-1 content-start justify-items-center rounded-md border-4 border-[#E9C18D] text-center shadow-md"
    >
      <h2 className="my-3 text-2xl font-semibold">Contact Me!</h2>

      <div className="">
        {/* <!-- Contact form --> */}
        <form id="contact-us-form" onSubmit={handleSubmit}>
          {success.length > 0 && (
            <h3 className="mb-3  text-center font-bold text-green-500">
              {success}
            </h3>
          )}
          {error.length > 0 && (
            <h3 className="mb-3 text-center font-bold text-red-500">{error}</h3>
          )}

          <label htmlFor="name">
            <span className="block text-sm font-medium">Your Full Name</span>
            <input
              type="text"
              className="mb-3 text-center text-black"
              id="name"
              name="name"
              placeholder="Enter your full name"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </label>

          <label htmlFor="email">
            <span className="block text-sm font-medium">Your Email</span>
            <input
              type="email"
              className="peer px-3 text-black"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p id="emailHelp" className="text-xs">
              We don&apos;t share your email with anyone.
            </p>
            <p className="invisible mt-2 text-sm text-pink-600 peer-invalid:visible">
              Please provide a valid email address.
            </p>
          </label>

          <label htmlFor="message">
            <span className="block text-sm">Your message</span>
            <textarea
              className="px-3 text-black"
              id="message"
              name="message"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </label>

          <div className="ml-3 block sm:inline-block">
            <ReCAPTCHA
              sitekey={SECRET_KEY}
              ref={captchaRef}
              onChange={handleOnChange}
              size="compact"
            />
          </div>

          <div>
            <button
              type="submit"
              id="submitBtn"
              className="mb-3 animate-pulse rounded bg-white px-4 py-2 font-bold text-black hover:bg-gray-700 hover:text-white"
              hidden={!hasCaptchaToken ? 'hidden' : ''}
            >
              Send Message!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Contact;
