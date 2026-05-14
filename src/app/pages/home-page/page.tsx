'use client';

import React from "react";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import About from "@/app/components/About";


export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
    </main>
  );
}