import { ImageResponse } from "next/og";

export const alt = "Nandini Vision — Photography for the beautifully lived.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          color: "#ffffff",
          background: "linear-gradient(160deg, #000000 0%, #0b0e2b 40%, #2C3480 100%)",
        }}
      >
        <div style={{ fontSize: 96, fontFamily: "serif", lineHeight: 1 }}>Nandini Vision</div>
        <div style={{ fontSize: 34, marginTop: 20, color: "#c8ccf5", fontFamily: "serif", fontStyle: "italic" }}>
          Photography for the beautifully lived.
        </div>
      </div>
    ),
    size
  );
}
