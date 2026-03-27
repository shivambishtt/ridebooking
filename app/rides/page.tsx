"use client";
import React from "react";
import { useSession } from "next-auth/react";

function Rides() {
  const session = useSession();
  return (
    <div>
      {session.data?.user.role === "captain"
        ? "<h1>Hey Welcome Captain</h1>"
        : `Hey User ${session.data?.user.name}`}
      <h1></h1>
    </div>
  );
}

export default Rides;
