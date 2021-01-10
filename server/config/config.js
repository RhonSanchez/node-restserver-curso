// =================================
// PORT
// =================================

process.env.PORT = process.env.PORT || 8081;

// =================================
// ENTORNO
// =================================

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// =================================
// EXPIRE TOKEN
// =================================

// =================================
// SEED AUHTENTICATION
// =================================
// 60 seg
// 60 min
// 24 hours
// 30 days

process.env.EXPIRE_TOKEN = "48h";

// =================================
// DATA BASE
// =================================

process.env.SEED = process.env.SEED || "este-es-el-seed-desarrollo";

let urlBD;

if (process.env.NODE_ENV === "dev") {
    urlBD = "mongodb://localhost:27017/cafe";
} else {
    urlBD = process.env.MONGO_URI;
}

process.env.URLDB;

// =================================
// GOOGLE CLIENT ID
// =================================

process.env.CLIENT_ID =
    process.env.CLIENT_ID ||
    "10631199224-gpp14mebrol5h4bjaralhcoauuu23igo.apps.googleusercontent.com";