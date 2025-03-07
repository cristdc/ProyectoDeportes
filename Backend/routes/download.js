const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/HOLA.exe', (req, res) => {
  const filePath = path.join(__dirname, '../uploads/EXE/HOLA.exe');
  res.download(filePath, 'HOLA.exe', (err) => {
    if (err) {
      res.status(500).send({
        message: "Error al descargar el archivo"
      });
    }
  });
});

module.exports = router; 