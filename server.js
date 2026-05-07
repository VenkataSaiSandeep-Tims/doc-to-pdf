import express from "express";
import multer from "multer";
import fs from "fs";
import libre from "libreoffice-convert";
import cors from "cors";

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/convert-to-pdf", upload.single("file"), async (req, res) => {
  try {

    const filePath = req.file.path;

    const inputBuffer = fs.readFileSync(filePath);

    libre.convert(inputBuffer, ".pdf", undefined, (err, done) => {

      if (err) {
        console.error("❌ LibreOffice Error:", err);
        return res.status(500).send(err.message || "Conversion failed");
      }

      res.setHeader("Content-Type", "application/pdf");
      res.send(done);

      fs.unlinkSync(filePath);
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});