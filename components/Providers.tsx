"use client";
import Squares from "./Squares";
import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

function Providers({ children }: Props) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <Squares
          speed={0.3}
          squareSize={40}
          direction="down"
          borderColor="rgba(255,255,255,0.08)"
          hoverFillColor="#222"
        />
      </div>
      <SessionProvider>{children}</SessionProvider>
    </div>
  );
}

export default Providers;
