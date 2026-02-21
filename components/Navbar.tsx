import Link from "next/link";
import { Button } from "./ui/button";

function Navbar() {
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
          <Button className="bg-primary px-4  py-0.5 border rounded-md hover:cursor-pointer ">
            Signup
          </Button>
        </div>
      </nav>
    </header>
  );
}
export default Navbar;
