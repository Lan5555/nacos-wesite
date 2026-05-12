'use client';
import CoreService from "@/app/hooks/auth-controller";
import React, {  useEffect, useState } from "react";

const HomePage: React.FC = () => {
    const [data, setData] = useState<string | null>(null);
    // Example usage of CoreService
    // You can replace this with actual API calls as needed
    const service:CoreService = new CoreService();
    const fetchData = async () => {
        const result = await service.get("users/v1/test");
        setData(result.message);
    }
    useEffect(() => {
        fetchData();
    }, [])
  return (
    <div className="w-full h-screen flex justify-center items-center flex-col">
      {data ? (
        <div>
          <p>{data}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default HomePage;
