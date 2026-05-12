export default function AccountsPage() {
  const user = {
    name: "Shivam Bisht",
    email: "shivam@example.com",
    phone: "+91 9876543210",
    rides: 128,
    rating: 4.9,
    joined: "July 2025",
  };

  const recentRides = [
    {
      id: 1,
      from: "Connaught Place",
      to: "Noida Sector 62",
      fare: "₹245",
      status: "Completed",
    },
    {
      id: 2,
      from: "Karol Bagh",
      to: "Rajouri Garden",
      fare: "₹180",
      status: "Completed",
    },
    {
      id: 3,
      from: "Dwarka",
      to: "IGI Airport",
      fare: "₹390",
      status: "Cancelled",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT PROFILE SECTION */}
        <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full bg-primary flex items-center justify-center text-4xl font-bold text-black shadow-lg">
              SB
            </div>

            <h1 className="mt-5 text-3xl font-bold">{user.name}</h1>
            <p className="text-zinc-400 mt-1">{user.email}</p>

            <div className="mt-6 w-full space-y-4">
              <div className="bg-zinc-800 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-zinc-400">Phone</span>
                <span className="font-semibold">{user.phone}</span>
              </div>

              <div className="bg-zinc-800 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-zinc-400">Joined</span>
                <span className="font-semibold">{user.joined}</span>
              </div>
            </div>

            <button className="mt-6 w-full py-3 rounded-2xl bg-primary text-black font-bold hover:opacity-90 transition-all">
              Edit Profile
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-xl">
              <p className="text-zinc-400">Total Rides</p>
              <h1 className="text-4xl font-bold mt-2">{user.rides}</h1>
            </div>

            <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-xl">
              <p className="text-zinc-400">Rating</p>
              <h1 className="text-4xl font-bold mt-2">⭐ {user.rating}</h1>
            </div>

            <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-xl">
              <p className="text-zinc-400">Wallet Balance</p>
              <h1 className="text-4xl font-bold mt-2">₹1,240</h1>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-xl">
            <h2 className="text-2xl font-bold mb-5">Quick Actions</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <button className="bg-zinc-800 hover:bg-primary hover:text-black transition-all rounded-2xl p-5 font-semibold">
                My Rides
              </button>

              <button className="bg-zinc-800 hover:bg-primary hover:text-black transition-all rounded-2xl p-5 font-semibold">
                Payments
              </button>

              <button className="bg-zinc-800 hover:bg-primary hover:text-black transition-all rounded-2xl p-5 font-semibold">
                Saved Places
              </button>

              <button className="bg-zinc-800 hover:bg-red-500 transition-all rounded-2xl p-5 font-semibold">
                Logout
              </button>
            </div>
          </div>

          {/* RECENT RIDES */}
          <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Rides</h2>
              <button className="text-primary font-semibold hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {recentRides.map((ride) => (
                <div
                  key={ride.id}
                  className="bg-zinc-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:scale-[1.01] transition-all"
                >
                  <div>
                    <p className="text-sm text-zinc-400">From</p>
                    <h3 className="font-semibold text-lg">{ride.from}</h3>
                  </div>

                  <div>
                    <p className="text-sm text-zinc-400">To</p>
                    <h3 className="font-semibold text-lg">{ride.to}</h3>
                  </div>

                  <div>
                    <p className="text-sm text-zinc-400">Fare</p>
                    <h3 className="font-semibold text-lg">{ride.fare}</h3>
                  </div>

                  <div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        ride.status === "Completed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {ride.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
