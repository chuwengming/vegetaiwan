import Image from 'next/image';
import Navbar from './Navbar';

export default function Header() {
  return (
    <header className="site-header">
      {/* Hero Banner Background */}
      <div className="banner-wrapper">
        <Image
          src="/banner_bg.png"
          alt="蔬食台灣促進會橫幅"
          fill
          className="banner-bg-image h-full w-full object-cover"
          priority
        />
        <div className="banner-overlay" />
        <div className="banner-content">
          <div className="banner-logo-wrap">
            <Image
              src="/Logo-2.png"
              alt="蔬食台灣促進會 Logo"
              width={450}
              height={180}
              style={{ height: "90%", width: "auto" }}
              className="banner-logo"
            />
          </div>
        </div>
      </div>

      {/* Sticky Navbar */}
      <Navbar />
    </header>
  );
}
