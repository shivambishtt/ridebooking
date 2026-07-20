import resend from "@/lib/resend";
import VehicleVerificationOTP from "@/emails/VehicleVerification";

export async function sendVehicleVerificationOTP({
  email,
  captainName,
  otp,
}: {
  email: string;
  captainName: string;
  otp: string;
}) {
  return await resend.emails.send({
    from: "EZ Rides <ezrides.com>",
    to: email,
    subject: "Vehicle Verification OTP",
    react: VehicleVerificationOTP({ captainName, otp }),
  });
}
