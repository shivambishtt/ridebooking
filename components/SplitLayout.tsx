import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface FormProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function SplitLayout({
  title,
  description,
  children,
}: FormProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full lg:w-1/2 min-h-125 grid md:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden">
        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-center p-10 ">
          <h1 className="text-5xl font-extrabold mb-6 text-foreground">
            {title}
          </h1>

          <h2 className="text-2xl font-semibold mb-4 text-foreground/90">
            Your Journey Starts Here
          </h2>

          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>

        {/* Right Section */}
        <div className="flex items-center border border-gray-800 rounded-xl justify-center p-8">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </Card>
    </div>
  );
}
