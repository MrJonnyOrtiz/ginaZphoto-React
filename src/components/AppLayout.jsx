import Logo from './Logo';
import Subheader from './Subheader';
import Carousel from './Carousel';
import Services from './Services';
import Sidebar from './Sidebar';
import Contact from './Contact';

function AppLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] sm:gap-3 md:grid-cols-[200px_1fr] md:gap-5 lg:grid-cols-[250px_1fr] lg:gap-7">
      <header className="my-3 grid grid-cols-1">
        <div className="sm:hidden">
          <Logo />
          <h1 className="text-center text-4xl">Gina Z Photography</h1>
        </div>
        <div className="hidden sm:block">
          <Sidebar />
        </div>
      </header>

      <main className="my-3">
        <div className="sm:hidden">
          <Subheader />
        </div>

        <Carousel />

        <div className="sm:hidden">
          <Services />
          <Contact />
        </div>
      </main>

      <footer className="text-center sm:col-span-2">
        <p>
          Powered by{' '}
          <a
            className=" text-blue-700 hover:underline"
            href="https://cloudrealmllc.com"
            target="_blank"
            rel="noreferrer"
          >
            Cloud Realm LLC.
          </a>{' '}
          &copy; {new Date().getFullYear()}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default AppLayout;
