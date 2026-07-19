import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VehicleVerificationProps {
  captainName: string;
  otp: string;
}

export default function VehicleVerificationOTP({
  captainName,
  otp,
}: VehicleVerificationProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your vehicle using this OTP</Preview>

      <Body
        style={{
          backgroundColor: "#f6f9fc",
          fontFamily: "Arial, sans-serif",
          padding: "30px 0",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            maxWidth: "600px",
            margin: "0 auto",
            padding: "40px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
          }}
        >
          <Heading
            style={{
              textAlign: "center",
              color: "#111827",
              marginBottom: "10px",
            }}
          >
            Vehicle Verification
          </Heading>

          <Text style={{ fontSize: "16px", color: "#374151" }}>
            Hi <strong>{captainName}</strong>,
          </Text>

          <Text
            style={{ fontSize: "16px", color: "#374151", lineHeight: "26px" }}
          >
            Thank you for registering your vehicle. To complete the verification
            process, please enter the One-Time Password (OTP) below in the app.
          </Text>

          <Section
            style={{
              textAlign: "center",
              margin: "35px 0",
            }}
          >
            <Text
              style={{
                display: "inline-block",
                backgroundColor: "#111827",
                color: "#ffffff",
                padding: "18px 36px",
                fontSize: "32px",
                fontWeight: "bold",
                letterSpacing: "8px",
                borderRadius: "10px",
                margin: 0,
              }}
            >
              {otp}
            </Text>
          </Section>

          <Text style={{ fontSize: "15px", color: "#6b7280" }}>
            This OTP is valid for <strong>10 minutes</strong>. Do not share this
            code with anyone. Our team will never ask you for your OTP.
          </Text>

          <Hr style={{ margin: "30px 0" }} />

          <Text
            style={{
              fontSize: "14px",
              color: "#6b7280",
              textAlign: "center",
            }}
          >
            If you didn&apos;t request vehicle verification, you can safely
            ignore this email.
          </Text>

          <Text
            style={{
              textAlign: "center",
              fontSize: "14px",
              color: "#9ca3af",
              marginTop: "30px",
            }}
          >
            © {new Date().getFullYear()} RideX. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
