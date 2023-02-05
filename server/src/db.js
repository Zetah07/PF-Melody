requiere('dotenv').config();
const {Sequelize} = requiere('sequelize');
const fs =requiere('fs');
const path = requiere('path');
const {DB_USER, DB_PASSWORD, DB_HOST, DB_NAME} = process.env;

const sequelize = new Sequelize(
    `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
{
    logging: false,
    native: false,
}
);

const basename = path.basename(__filename);
const modelDefiners = [];

//Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
    .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
    .forEach((file) => {
        modelDefiners.push(require(path.join(__dirname, '/models', file)));
    }
);

//Agregamos el modelo de User a modelDefiners
modelDefiners.forEach(model => model(sequelize));
//Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map(entry => {
    return [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]];
});
sequelize.models = Object.fromEntries(capsEntries);

//En sequelize.models están todos los modelos importados como propiedades
//Para relacionarlos hacemos un destructuring
const { Product, Category, User } = sequelize.models;

//Aca vendrian las relaciones
// Product.belongsTo(Category);
// Category.hasMany(Product);
//User.belongsToMany(Product);

module.exports = {
    ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
    conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};

