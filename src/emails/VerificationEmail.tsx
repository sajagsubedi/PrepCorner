interface Props {
  fullName: string;
  verificationCode: string;
  formattedExpiry: string;
  verificationLink: string;
}

export const VerificationEmail = ({
  fullName,
  verificationCode,
  formattedExpiry,
  verificationLink,
}: Props) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f8f8f8",
      padding: "20px",
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        textAlign: "center",
      }}
    >
      <h2 style={{ color: "#333" }}>
        Welcome to <span style={{ color: "#3a7cdc" }}>PrepCorner</span>,{" "}
        {fullName}!
      </h2>
      <p style={{ color: "#555" }}>
        Thank you for signing up. Please verify your email using the code below:
      </p>
      <p style={{ fontSize: "24px", fontWeight: "bold", color: "#3a7cdc" }}>
        {verificationCode}
      </p>
      <p>
        Or
        <a href={verificationLink} style={{ color: "#3a7cdc" }}>
          click here
        </a>
        to verify.
      </p>
      <p style={{ color: "#777" }}>
        This code is valid until <strong>{formattedExpiry}</strong>. If you did
        not sign up, please ignore this email.
      </p>
      <footer style={{ marginTop: "20px", fontSize: "12px", color: "#aaa" }}>
        &copy; 2025 PrepCorner. All rights reserved.
      </footer>
    </div>
  </div>
);
