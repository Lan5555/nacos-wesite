'use client';

import React, { useState } from "react";
import Navbar from "./Navbar/Navbar";
import About from "./About/About";
import Hero from "./Hero/Hero";
import Resources from "./Resources/Resources";
import Excos from "./Excos/Excos";
import Updates from "./Updates/Updates";
import Results from "./Results/Results";
import Events from "./Events/Events";
import Developers from "./Developers/Developers";
import Contact from "./Contact/Contact";
import Footer from "./Footer/Footer"

const HomePage: React.FC = () => {
  const [heroData, setHeroData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  return (
    <main>
      <Navbar />
      <Hero sharedData={(data) => setHeroData(data)} isLoading={(loading) => setLoading(loading)} />
      <About data={heroData} loading={loading} />
      <Resources />
      <Excos/>
      <Updates />
      <Results />
      <Events />
      <Contact />
      <Developers />
      <Footer/>
    </main>
  );
}

export default HomePage;