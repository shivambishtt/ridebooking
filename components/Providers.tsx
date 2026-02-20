"use client";
import Squares from "./Squares";

function Providers({ children }) {
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

      {children}
    </div>
  );
}

export default Providers;
