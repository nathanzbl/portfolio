import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Projects } from './sections/Projects';
import { Resume } from './sections/Resume';

export function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Resume />
      <Footer />
    </>
  );
}
