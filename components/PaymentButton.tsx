"use client";
import React from "react";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";

function PaymentButton({ fare }: { fare: number }) {
  const rideId = useParams();
  const handlePayment = async () => {
    const response = await fetch(`/api/ride/${rideId}/create-order`);
    const data = await response.json();
    
  };
  return (
    <div>
      <Button onClick={handlePayment}>Pay</Button>
    </div>
  );
}

export default PaymentButton;
