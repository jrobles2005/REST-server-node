//============================
//Puerto
//============================
process.env.PORT = process.env.PORT || 3000;
//============================
//Entorno
//============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//============================
//Expiracion del token
//============================

process.env.CADUCIDAD_TOKEN = '48h';


//============================
//SEED de autenticacion
//============================

process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo'

//============================
//Conexion BD
//============================
let urlDB;
if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//forzamos la conexion a la base de datos de AtlasDb

//process.env.URLDB = 'mongodb+srv://cafe-user:user-cafe@cluster0.8epos.mongodb.net/cafe?retryWrites=true&w=majority';
//============================
//Google client ID
//============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '637925485857-dhv48bc6v5fbnh7aug906g87tcp23s90.apps.googleusercontent.com';