"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import socket from "@/lib/socket";

function SocketHandler({ children }: { children: React.ReactNode }) {
  const session = useSession();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    if (session.data?.user.id) {
      socket.emit("join", { userId: session.data.user.id });
      console.log("Joined", session.data.user.id);
    }
  }, [session]);

  return <>{children}</>;
}

export default SocketHandler;
