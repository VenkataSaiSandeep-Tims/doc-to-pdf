import express from "express";
import multer from "multer";
import fs from "fs";
import libre from "libreoffice-convert";
import cors from "cors";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://metadata.timsstudio.tech"
  ],
  methods: ["GET", "POST"],
}));

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.post("/convert-to-pdf", upload.single("file"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const filePath = req.file.path;

    const inputBuffer = fs.readFileSync(filePath);

    libre.convert(inputBuffer, ".pdf", undefined, (err, done) => {

      if (err) {
        console.error("❌ LibreOffice Error:", err);
        return res.status(500).send(err.message || "Conversion failed");
      }

      res.setHeader("Content-Type", "application/pdf");
      res.send(done);

      // cleanup
      fs.unlinkSync(filePath);
    });

  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});