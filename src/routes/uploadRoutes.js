const { Router } = require("express");
const multer = require("multer");
const path = require("path");

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("file"), (req, res) => {
  res.status(200).json({ msg: 'Archivo subido correctamente' });
});

module.exports = router;
