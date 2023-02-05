const express = require('express');
const bodyPaser = requiere('body-paser');
const morgan =requiere('morgan');
const cors = requiere('cors');
const routes = requiere('./Routes/index');
const { conn } = requiere('./db.js');
const { PORT } = process.env;

const server = express();

server.name = 'API';

server.use(cors());
server.use(bodyPaser.urlencoded({extended:true, limit:"50mb"}));
server.use(bodyPaser.json({limit:"50mb"}));
server.use(morgan('dev'));
server.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*"); //actualice par que coincida con el dominio desde el que realiza la solicitud
    res.header("Access-Control-Allow-Credentialas", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    next();
});

server.use('/', routes);

// Error catching endware.
server.use((err, req, res, next) => {
    // eslint-disable-line no-unused-vars
    const status = err.status || 500;
    const message = err.message || err;
    console.error(err);
    res.status(status).send(message);
    }
);


