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
        console.error(err);
        return res.status(500).send("Conversion failed");
      }

      res.setHeader("Content-Type", "application/pdf");
      res.send(done);
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});