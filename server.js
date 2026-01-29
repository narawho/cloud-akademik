console.log("SERVER DIMULAI");

const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const fs = require("fs");

// ====== SAFE START (ANTI CRASH) ======
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

const VIEWS_DIR = path.join(__dirname, "views");
const PUBLIC_DIR = path.join(__dirname, "public");

// ===================================

app.use(express.urlencoded({ extended: true }));
app.use(express.static(PUBLIC_DIR));
app.use("/uploads", express.static(UPLOAD_DIR));

let tugas = [];

// UPLOAD CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// ROUTES
app.get("/", (req, res) => {
  res.sendFile(path.join(VIEWS_DIR, "index.html"));
});

app.get("/data-tugas", (req, res) => {
  res.sendFile(path.join(VIEWS_DIR, "data.html"));
});

app.post("/kumpul", upload.single("file"), (req, res) => {
  const { nama, matkul, judul } = req.body;

  tugas.push({
    nama,
    matkul,
    judul,
    file: req.file ? req.file.filename : null,
    waktu: new Date().toLocaleString("id-ID")
  });

  res.redirect("/");
});

app.get("/data", (req, res) => {
  res.json(tugas);
});

app.get("/hapus/:id", (req, res) => {
  tugas.splice(req.params.id, 1);
  res.redirect("/data-tugas");
});

// ====== CLOUD SAFE PORT ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server jalan di port", PORT);
});
