'use client';
import CoreService from "@/app/hooks/auth-controller";
import React, {  useEffect } from "react";

const HomePage: React.FC = () => {
    // Example usage of CoreService
    // You can replace this with actual API calls as needed
    const service:CoreService = new CoreService();
    const fetchData = async () => {
        const result = await service.get("/api/v1/test");
        console.log(result);
    }
    useEffect(() => {
        fetchData();
    }, [])
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">   

    <h1 className="text-4xl font-bold mb-4">Welcome to Nacos Unijos</h1>
    <p className="text-lg text-center mb-8">
      Nacos Unijos is a centralized digital platform designed to connect, inform, and empower computing students across institutions in Nigeria. Our mission is to foster collaboration, share knowledge, and provide resources to help students excel in their academic and professional pursuits.
    </p>
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">   
        Get Started
        </button>
    </div>
  );
};

export default HomePage;
