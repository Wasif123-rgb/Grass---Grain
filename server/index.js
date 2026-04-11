const express = require("express");
const { co2 } = require("@tgwf/co2");

const app = express();
const port = 3000;

// CO2 MODEL
const co2Emission = new co2({ model: "swd" });

app.use(express.json());

/* =========================
   CO2 MIDDLEWARE (FIXED)
========================= */
app.use((req, res, next) => {
  let requestBytes = 0;

  try {
    requestBytes =
      Buffer.byteLength(JSON.stringify(req.body || {}), "utf8") +
      Buffer.byteLength(JSON.stringify(req.query || {}), "utf8") +
      Buffer.byteLength(JSON.stringify(req.headers || {}), "utf8");
  } catch (e) {}

  res.on("finish", () => {
    let responseBytes = 0;

    try {
      const contentLength = res.getHeader("content-length");

      if (contentLength) {
        responseBytes = parseInt(contentLength);
      } else {
        // fallback (important for res.send / small responses)
        responseBytes = Buffer.byteLength("response", "utf8");
      }

      const totalBytes = requestBytes + responseBytes;
      const emissions = co2Emission.perByte(totalBytes, false);

      console.log("\n🔥 REQUEST FINISHED");
      console.log("📦 Bytes transferred:", totalBytes, "bytes");
      console.log("🌱 CO2 emissions:", emissions.toFixed(6), "grams\n");
    } catch (err) {
      console.log("CO2 error:", err.message);
    }
  });

  next();
});

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Hello, sustainable world!");
});

/* =========================
   START SERVER
========================= */
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});