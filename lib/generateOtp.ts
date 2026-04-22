import crypto from "crypto";

function generateOTP() {
  return crypto.randomInt(1000, 10000).toString();
}
export default generateOTP;
