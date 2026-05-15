'use client';

import React, { useState } from "react";
import Navbar from "./Navbar/Navbar";
import About from "./About/About";
import Hero from "./Hero/Hero";
import Resources from "./Resources/Resources";

const HomePage: React.FC = () => {
  const [heroData, setHeroData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  return (
    <main>
      <Navbar />
      <Hero sharedData={(data) => setHeroData(data)} isLoading={(loading) => setLoading(loading)} />
      <About data={heroData} loading={loading} />
      <Resources />
    </main>
  );
}

export default HomePage;