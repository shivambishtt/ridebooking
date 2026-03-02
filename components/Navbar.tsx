"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";

function Navbar() {
  const session = useSession();
  const handleLogout = async () => {
    const response = await signOut();
    if (response?.ok) {
      toast.success("Logged out sucessfully");
    } else {
      toast.error("An unknown error occured");
    }
  };
  return (
    <header>
      <nav className="bg-card h-18 mx-auto w-2/4 rounded-3xl mt-6 flex items-center justify-between text-center px-6">
        <div>
          <p>RideBook</p>
        </div>
        <div>
          <ul className="text-md list-none flex items-center justify-center gap-6">
            <Link href="/">Home</Link>
            <Link href="/account">Account</Link>
            <Link href="/rides">Rides</Link>
          </ul>
        </div>
        <div>
          {session?.data?.user ? (
            <Link href="/">
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="bg-primary px-4  py-0.5 border rounded-md hover:cursor-pointer "
              >
                Logout
              </Button>
            </Link>
          ) : (
            <Link href="/signin">
              <Button className="bg-primary px-4  py-0.5 border rounded-md hover:cursor-pointer ">
                Signin
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
export default Navbar;
