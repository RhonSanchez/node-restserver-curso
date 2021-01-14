const express = require("express");
let { verifyToken } = require("../middlewares/authentication");

let app = express();
let Producto = require("../models/producto");

// =================================
// Show products
// =================================
app.get("/producto", verifyToken, (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);
  let limite = req.query.limite || 5;
  limite = Number(limite);
  Producto.find({})
    .populate("usuario categoria")
    .skip(desde)
    .limit(limite)
    .exec((err, productos) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Producto.count({}, (err, conteo) => {
        res.json({
          ok: true,
          productos,
          cuantos: conteo,
        });
      });
    });
});

// =================================
// Show product by Id
// =================================
app.get("/producto/:id", verifyToken, (req, res) => {
  let id = req.params.id;
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!productoDB) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      producto: productoDB,
    });
  });
});

// =================================
// Search product
// =================================
app.get("/producto/buscar/:termino", verifyToken, (req, res) => {
  let termino = req.params.termino;
  let regex = new RegExp(termino, "i");
  Producto.find({ nombre: regex })
    .populate("usuario categoria")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        producto: productos,
      });
    });
});

// =================================
// Create product
// =================================
app.post("/producto", verifyToken, (req, res) => {
  let body = req.body;
  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    categoria: body.categoria,
    usuario: req.usuario._id,
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      producto: productoDB,
    });
  });
});
// =================================
// Update product
// =================================
app.put("/producto/:id", verifyToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;
  Producto.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        producto: productoDB,
      });
    }
  );
});

// =================================
// Delete product
// =================================
app.delete("/producto/:id", verifyToken, (req, res) => {
  let id = req.params.id;
  let disponible = {
    disponible: false,
  };
  Producto.findByIdAndUpdate(
    id,
    disponible,
    { new: true, runValidators: true },
    (err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        producto: productoDB,
      });
    }
  );
});

module.exports = app;
