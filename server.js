console.log("SERVER DIMULAI");

const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const fs = require("fs");

// =====================
// MIDDLEWARE
// =====================
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// =====================
// PASTIKAN FOLDER UPLOAD ADA
// =====================
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// =====================
// DATA TUGAS (sementara, RAM)
// =====================
let tugas = [];

// =====================
// KONFIGURASI MULTER
// =====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// =====================
// ROUTE HALAMAN
// =====================

// halaman kumpul tugas
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// halaman data tugas
app.get("/data-tugas", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "data.html"));
});

// =====================
// ROUTE AKSI
// =====================

// tambah tugas + upload file
app.post("/kumpul", upload.single("file"), (req, res) => {
  const { nama, matkul, judul } = req.body;
  const file = req.file ? req.file.filename : "";

  tugas.push({ nama, matkul, judul, file });
  res.redirect("/");
});

// hapus tugas
app.get("/hapus/:id", (req, res) => {
  const id = req.params.id;

  // hapus file fisik (opsional tapi rapi)
  if (tugas[id] && tugas[id].file) {
    const filePath = path.join(__dirname, "uploads", tugas[id].file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  tugas.splice(id, 1);
  res.redirect("/data-tugas");
});

// edit tugas
app.post("/edit/:id", (req, res) => {
  const { nama, matkul, judul } = req.body;
  const id = req.params.id;

  tugas[id] = {
    ...tugas[id],
    nama,
    matkul,
    judul
  };

  res.redirect("/data-tugas");
});

// =====================
// API DATA (JSON)
// =====================
app.get("/data", (req, res) => {
  res.json(tugas);
});

// =====================
// SERVER
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server jalan di port", PORT);
});
