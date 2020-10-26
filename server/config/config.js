//============================
//Puerto
//============================
process.env.PORT = process.env.PORT || 3000;
//============================
//Entorno
//============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//============================
//Conexion BD
//============================
let urlDB;
if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://cafe-user:user-cafe@cluster0.8epos.mongodb.net/cafe?retryWrites=true&w=majority';
}

process.env.URLDB = urlDB;

//forzamos la conexion a la base de datos de AtlasDb

//process.env.URLDB = 'mongodb+srv://cafe-user:user-cafe@cluster0.8epos.mongodb.net/cafe?retryWrites=true&w=majority';