'use client';

import React from "react";
import Navbar from "./Navbar/Navbar";
import About from "./About/About";
import Hero from "./Hero/Hero";


const HomePage: React.FC = () => {
  const [heroData, setHeroData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  return (
    <main>
      <Navbar />
      <Hero sharedData={(data) => setHeroData(data)} isLoading={(loading) => setLoading(loading)} />
      <About data={heroData} loading={loading} />
    </main>
  );
}
export default HomePage;