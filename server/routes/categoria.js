const express = require("express");

let { verifyToken, verifyAdminRole } = require("../middlewares/authentication");

let app = express();
let Categoria = require("../models/categoria");

// =================================
// Show categories
// =================================
app.get("/categoria", verifyToken, (req, res) => {
    Categoria.find({})
        .sort("descripcion")
        .populate("usuario", "nombre email")
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            Categoria.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo,
                });
            });
        });
});

// =================================
// Show one category
// =================================
app.get("/categoria/:id", verifyToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            categoria,
        });
    });
});

// =================================
// create category
// =================================
app.post("/categoria", verifyToken, (req, res) => {
    let body = req.body;
    console.log(req);
    let categoria = new Categoria({
        usuario: req.usuario._id,
        descripcion: body.descripcion,
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB,
        });
    });
});

// =================================
// update category
// =================================
app.put("/categoria/:id", [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion,
    };
    Categoria.findByIdAndUpdate(
        id,
        descCategoria, { new: true, runValidators: true },
        (err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                categoria: categoriaDB,
            });
        }
    );
});

// =================================
// delete category
// =================================
app.delete("/categoria/:id", [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB,
        });
    });
});

module.exports = app;