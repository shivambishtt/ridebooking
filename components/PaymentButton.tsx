"use client";
import React from "react";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { loadRazorpay } from "@/lib/razorpay";
import { useSession } from "next-auth/react";
import socket from "@/lib/socket";
import type { Ride } from "@/components/RiderView";
import { Loader2 } from "lucide-react";

interface Props {
  fare: number;
  ride: Ride;
  paymentLoading: boolean;
  setPaymentLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function PaymentButton({
  fare,
  ride,
  paymentLoading,
  setPaymentLoading,
}: Props) {
  const { rideId } = useParams();
  const session = useSession();

  const handlePayment = async () => {
    try {
      setPaymentLoading(true);

      const loaded = await loadRazorpay();

      if (!loaded) {
        toast.error("Failed to load razorpay payment gateway");
        return;
      }

      const orderRes = await fetch(`/api/ride/${rideId}/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: fare,
          rideId,
        }),
      });

      if (!orderRes.ok) {
        const data = await orderRes.json();
        toast.error(data.message, {
          position: "top-center",
          style: {
            background: "#D50419",
          },
        });
        return;
      }

      const { order } = await orderRes.json();
      const orderId = order.id;
      const amount = order.amount;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: "INR",
        name: "EZRides",
        description: "Payment for your ride",
        order_id: orderId,

        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled", {
              position: "top-center",
              style: {
                background: "#D50419",
              },
            });
          },
        },

        handler: async (response: any) => {
          const verifyRes = await fetch(`/api/ride/${rideId}/verify-payment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              razorpay_payment_id: response.razorpay_payment_id,
              rideId,
            }),
          });

          const data = await verifyRes.json();

          if (verifyRes.ok) {
            toast.success("Payment successful!", {
              position: "top-center",
              style: {
                background: "#418B24",
              },
            });

            if (session.data?.user.id && ride?.captain?._id) {
              socket.emit("payment-completed", {
                rideId,
                riderId: session.data.user.id,
                captainId: ride.captain._id,
              });
            }
          } else {
            toast.error(data.message, {
              position: "top-center",
              style: {
                background: "#D50419",
              },
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
          color: "#418B24",
        },
      };

      const razorpay = new (window as any).Razorpay(options);

      razorpay.on("payment.failed", (response: any) => {
        toast.error(`Payment failed: ${response.error.description}`, {
          position: "top-center",
          style: {
            background: "#D50419",
          },
        });
      });

      razorpay.open();
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong", {
        position: "top-center",
        style: {
          background: "#D50419",
        },
      });
    } finally {
      setPaymentLoading(false);
    }
  };
  return (
    <div>
      {ride.status === "payment_pending" && (
        <Button
          onClick={handlePayment}
          disabled={paymentLoading}
          className="disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {paymentLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            "Pay"
          )}
        </Button>
      )}
    </div>
  );
}

export default PaymentButton;
