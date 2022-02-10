import { useState, useEffect } from 'react';
import MailchimpSubscribe from "react-mailchimp-subscribe";

const CustomForm = ({ status, message, onValidated }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    console.log('Submit');
    e.preventDefault();
    email &&
    email.indexOf("@") > -1 &&
    onValidated({
      EMAIL: email,
    });
  }

  console.log("status: ", status);

  useEffect(() => {
    if(status === "success") setEmail('');
  }, [status])

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="max-w-sm mx-auto">
      {status === "sending" && (
        <div
          className="my-10 text-center max-w-md"
          >
          sending...
        </div>
      )}
      {status === "error" && (
        <div 
          className="my-10 text-center max-w-md"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      {status === "success" && (
        <div
          className="my-10 text-center max-w-md"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}

      <div className="flex flex-col">
        <div className="min-w-0">
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="block w-full text-yellow-300 placeholder-gray-700 bg-black border-2 border-gray-700 py-3 px-5 text-bold focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="mt-5 text-yellow-300 bg-black-300 border-2 border-yellow-300 py-3 px-5 text-bold hover:bg-yellow-300 hover:text-black"
        >
          Join the NoMA Newsletter
        </button>
      </div>
    </form>
  );
};

function Newsletter() {
  const endPoint = "https://amentistudio.us14.list-manage.com/subscribe/post?u=6dae4459c81e8493865871ca5&amp;id=3ec105c984";
  return (
    <section className="flex flex-col content-center my-20">
      <img src={require('../images/noma-news.svg').default} width="174" alt="NoMA Newsletter" className="mx-auto mt-20" />
      <div className="px-4 sm:px-6 mt-20">
        <h1 className="h1 lg:text-5xl md:text-4xl text-3xl mb-8 text-center font-extrabold" data-aos="fade-down">
          Would you like to know more?
        </h1>
        <p className="max-w-2xl mx-auto my-8 text-center">
          Subscribe to our newsletter to get updates directly to your inbox.
          Once a month, you will receive an overview of progress. We promise we won't spam you.
        </p>
      </div>

      <div className="mb-20 w-full">
        <MailchimpSubscribe
          url={endPoint} 
          render={({ subscribe, status, message }) => (
            <CustomForm
                status={status} 
                message={message}
                onValidated={formData => subscribe(formData)}
            />
          )}
        />
      </div>
    </section>
  );
}

export default Newsletter;
