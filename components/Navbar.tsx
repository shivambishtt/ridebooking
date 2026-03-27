"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import getInitials from "@/lib/getInitials";

function Navbar() {
  const session = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully", {
      position: "top-center",
      style: {
        background: "#418B24",
      },
    });
  };

  return (
    <header className="px-4 mt-6">
      <nav className="bg-card mx-auto max-w-3xl rounded-3xl px-6 py-3 flex items-center justify-between">
        <Link href="/" className="text-foreground font-semibold text-lg">
          RideBook 🚕
        </Link>

        <ul className="hidden md:flex items-center gap-2 list-none">
          <li>
            <Link
              href="/"
              className="text-md text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/account"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted"
            >
              Account
            </Link>
          </li>
          <li>
            <Link
              href="/rides"
              className="text-md text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted"
            >
              Rides
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-3">
          {session?.data?.user ? (
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="text-sm px-4 py-1.5 rounded-xl hover:cursor-pointer"
            >
              Logout
            </Button>
          ) : (
            <>
              <Link href="/signin">
                <Button className="text-sm bg-white px-4 py-1.5 rounded-xl hover:cursor-pointer hover:bg-mauve-200">
                  Signin
                </Button>
              </Link>
              <Link href="/onboarding">
                <Button className="hidden sm:block text-sm px-4 py-1.5 rounded-xl hover:cursor-pointer">
                  Signup
                </Button>
              </Link>
            </>
          )}

          <Button
            className="md:hidden bg-gray-300 rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
          {session.data?.user ? (
            <Avatar className="sm:block hidden border-red-600">
              <AvatarImage src="https://github.com/shivambishtt/" />
              <AvatarFallback className="bg-red-600 text-white">
                {getInitials(session?.data?.user?.name ?? "")}
              </AvatarFallback>
            </Avatar>
          ) : (
            ""
          )}
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden mx-auto max-w-3xl mt-2 bg-card rounded-2xl px-4 py-3 flex flex-col gap-1">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            Home
          </Link>
          <Link
            href="/account"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            Account
          </Link>
          <Link
            href="/rides"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            Rides
          </Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;
