import express from "express";
import multer from "multer";
import fs from "fs";
import libre from "libreoffice-convert";
import cors from "cors";

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/convert-docx", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const docxBuf = fs.readFileSync(filePath);

    libre.convert(docxBuf, ".pdf", undefined, (err, done) => {
      if (err) {
    console.error("❌ LibreOffice Error:", err);

    // 👇 SEND REAL ERROR BACK
    return res.status(500).send(err.message || "Conversion failed");
  }

      res.setHeader("Content-Type", "application/pdf");
      res.send(done);
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});