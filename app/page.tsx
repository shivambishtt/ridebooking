import Link from "next/link";

function page() {
  return (
    <div>
      <section className="min-h-[50vh] flex items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl  font-bold ">
            Ride Smarter.
            <br />
            Ride with
            <span className="text-primary"> RideBook 🚕</span>
          </h1>
          <p className="text-muted-foreground text-md">
            Beat the last minute rush! Schedule rides in advance
          </p>
        </div>
      </section>

      <section>
        <div className="flex justify-center">
          <h1 className="text-4xl items-center font-bold ">How it Works</h1>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
          <div className="bg-card border border-border w-full md:w-2/5 p-6 rounded-2xl">
            <div className="space-y-3">
              <p className="text-primary text-3xl font-bold">01</p>
              <h3 className="text-xl font-semibold text-foreground">
                Choose Ride 🚖
              </h3>
              <p className="text-muted-foreground text-sm">
                Select bike or cab and enter your pickup & drop location.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border w-full md:w-2/5 p-6 rounded-2xl">
            <div className="space-y-3">
              <p className="text-primary text-3xl font-bold">02</p>
              <h3 className="text-xl font-semibold text-foreground">
                Track Driver 📍
              </h3>
              <p className="text-muted-foreground text-sm">
                Get matched instantly and track your driver in real-time.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border w-full md:w-2/5 p-6 rounded-2xl">
            <div className="space-y-3">
              <p className="text-primary text-3xl font-bold">03</p>
              <h3 className="text-xl font-semibold text-foreground">
                Reach Destination 📌
              </h3>
              <p className="text-muted-foreground text-sm">
                Enjoy a smooth ride with transparent pricing and safety.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-border mt-15">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <h2 className="text-2xl font-bold">
                RideBook <span className="text-primary">🚕</span>
              </h2>

              <p className="text-muted-foreground mt-4 text-sm leading-6">
                RideBook makes commuting smarter with secure payments, live
                driver tracking, ride history, and 24×7 customer support.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>

              <ul className="space-y-3 text-muted-foreground">
                <li className="hover:text-primary cursor-pointer">Home</li>
                <li className="hover:text-primary cursor-pointer">Book Ride</li>
                <li className="hover:text-primary cursor-pointer">
                  Ride History
                </li>
                <Link href="/account">
                  <li className="hover:text-primary cursor-pointer">Account</li>
                </Link>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Features</h3>

              <ul className="space-y-3 text-muted-foreground">
                <li>🚖 Live Driver Tracking</li>
                <li>💳 Secure Payments</li>
                <li>📜 Ride History</li>
                <li>🎧 24×7 Support</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Contact</h3>

              <div className="space-y-3 text-muted-foreground text-sm">
                <p>📧 support@ridebook.com</p>
                <p>📞 +91 98765 43210</p>
                <p>📍 New Delhi, India</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2026 RideBook. All rights reserved.</p>

            <div>
              <span>Made with ❤️ by {"Shivam"}</span>
            </div>

            <div className="flex gap-6">
              <span className="hover:text-primary cursor-pointer">
                Privacy Policy
              </span>

              <span className="hover:text-primary cursor-pointer">
                Terms of Service
              </span>

              <span className="hover:text-primary cursor-pointer">Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default page;
