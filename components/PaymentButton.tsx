"use client";
import React from "react";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { loadRazorpay } from "@/lib/razorpay";
import { useSession } from "next-auth/react";

function PaymentButton({ fare }: { fare: number }) {
  const { rideId } = useParams();
  const session = useSession();

  const handlePayment = async () => {
    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error("Failed to load payment gateway");
      return;
    }
    const orderRes = await fetch(`/api/ride/${rideId}/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: fare, rideId }),
    });
    const { orderId, amount } = await orderRes.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount, // in paise
      currency: "INR",
      name: "YourAppName",
      description: "Ride Payment",
      order_id: orderId,

      handler: async (response: any) => {
        const verifyRes = await fetch(`/api/ride/${rideId}/verify-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            rideId,
            riderId: session.data?.user.id,
          }),
        });

        const data = await verifyRes.json();
        if (verifyRes.ok) {
          toast.success("Payment successful!", {
            position: "top-center",
            style: { background: "#418B24" },
          });
        } else {
          toast.error(data.message, {
            position: "top-center",
            style: { background: "#D50419" },
          });
        }
      },

      prefill: {
        name: session.data?.user.name,
        email: session.data?.user.email,
      },

      config: {
        display: {
          blocks: {
            upi: {
              name: "Pay via UPI",
              instruments: [{ method: "upi" }],
            },
            card: {
              name: "Pay via Card",
              instruments: [{ method: "card" }],
            },
          },
          sequence: ["block.upi", "block.card"],
          preferences: {
            show_default_blocks: true, 
          },
        },
      },

      theme: {
        color: "#your-primary-color",
      },
    };

    const razorpay = new (window as any).Razorpay(options);

    razorpay.on("payment.failed", (response: any) => {
      toast.error(`Payment failed: ${response.error.description}`, {
        position: "top-center",
        style: { background: "#D50419" },
      });
    });

    razorpay.open();
  };
  return (
    <div>
      <Button onClick={handlePayment}>Pay</Button>
    </div>
  );
}

export default PaymentButton;
