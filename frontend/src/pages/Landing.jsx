import Navbar from '../components/Navbar';
import AmbientAtmosphere from '../components/AmbientAtmosphere';
import Hero from '../components/landing/Hero';
import WorkExcerpt from '../components/landing/WorkExcerpt';
import Stats from '../components/landing/Stats';
import LiveDemo from '../components/landing/LiveDemo';
import Footer from '../components/landing/Footer';

export default function Landing() {
  return (
    <div className="relative bg-ink">
      <AmbientAtmosphere />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <WorkExcerpt />
        <Stats />
        <LiveDemo />
        <Footer />
      </div>
    </div>
  );
}