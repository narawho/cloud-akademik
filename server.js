console.log("SERVER DIMULAI");

const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const fs = require("fs");

// BUAT FOLDER UPLOAD JIKA BELUM ADA
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

let tugas = [];

// MULTER CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

// HALAMAN KUMPUL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// HALAMAN DATA
app.get("/data-tugas", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "data.html"));
});

// SIMPAN TUGAS
app.post("/kumpul", upload.single("file"), (req, res) => {
  const { nama, matkul, judul } = req.body;

  tugas.push({
    nama,
    matkul,
    judul,
    file: req.file ? req.file.filename : "",
    waktu: new Date().toLocaleString("id-ID")
  });

  res.redirect("/");
});

// API DATA
app.get("/data", (req, res) => {
  res.json(tugas);
});

// HAPUS
app.get("/hapus/:id", (req, res) => {
  tugas.splice(req.params.id, 1);
  res.redirect("/data-tugas");
});

// PORT RAILWAY (WAJIB)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("Server jalan di port", PORT)
);
