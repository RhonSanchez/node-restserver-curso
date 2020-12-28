const jwt = require("jsonwebtoken");

// =================================
// VERIFY TOKEN
// =================================

let verifyToken = (req, res, next) => {
    let token = req.get("token");
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token no valido",
                },
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

// =================================
// VERIFY ADMIN ROLE
// =================================

let verifyAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    console.log(usuario);
    if (usuario.role !== "ADMIN_ROLE") {
        return res.status(401).json({
            ok: false,
            err: {
                message: "Usuario no tiene permisos",
            },
        });
    }
    next();
};

module.exports = {
    verifyToken,
    verifyAdminRole,
};