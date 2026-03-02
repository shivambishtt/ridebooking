import React from "react";

function page() {
  return (
    <div>
      <section className="min-h-[50vh] flex items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-3xl">
          <h1 className="text-6xl font-bold ">
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

        <div className="flex items-center justify-center gap-6 mt-8">
          <div className="bg-card border border-border w-2/5 p-6 rounded-2xl">
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

          <div className="bg-card border border-border w-2/5 p-6 rounded-2xl">
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

          <div className="bg-card border border-border w-2/5 p-6 rounded-2xl">
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
    </div>
  );
}

export default page;
