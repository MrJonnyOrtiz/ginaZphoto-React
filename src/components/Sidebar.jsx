import Logo from './Logo';
import Subheader from './Subheader';
import Services from './Services';
import Contact from './Contact';

function Sidebar() {
  return (
    <div className="text-center">
      <Logo />
      <h1 className="text-3xl">Gina Z Photography</h1>
      <Subheader />
      <Services />
      <Contact />
    </div>
  );
}

export default Sidebar;
