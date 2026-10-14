import React, { useEffect, useRef } from 'react';
import Hero from './sections/hero/Hero';
import About from './sections/about/About';
import Services from './sections/services/Services';
import ServicesDetail1 from './sections/servicesDetail1/ServicesDetail1';
import ServicesDetail2 from './sections/servicesDetail2/ServicesDetail2';
import Specialization from './sections/specialization/Specialization';
import Process from './sections/process/Process';
import WhyUs from './sections/whyUs/WhyUs';
import Segments from './sections/segments/Segments';
import Contact from './sections/contact/Contact';
import './Landing.css';

const Landing: React.FC = () => {
  const landingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = landingRef.current?.querySelectorAll(
      '.landing__section:not(.landing__section--visible)'
    );
    if (!sections || sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('landing__section--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing" ref={landingRef}>
      <Hero />
      <About />
      <Services />
      <ServicesDetail1 />
      <ServicesDetail2 />
      <Specialization />
      <Process />
      <WhyUs />
      <Segments />
      <Contact />
    </div>
  );
};

export default Landing;
