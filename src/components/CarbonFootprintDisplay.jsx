import { useCarbonFootprint } from "react-carbon-footprint";

export default function CarbonFootprintDisplay() {
  const [gCO2, bytesTransferred] = useCarbonFootprint();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        background: "rgba(255,255,255,0.85)",
        padding: "10px",
        borderRadius: "8px",
        zIndex: 1000,
      }}
    >
      <h3>🌱 Network Carbon Footprint</h3>
      <p>Bytes Transferred: {bytesTransferred} bytes</p>
      <p>CO₂ Emissions: {Number(gCO2 || 0).toFixed(2)} g CO₂eq</p>
    </div>
  );
}