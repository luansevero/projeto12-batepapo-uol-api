import express, { application, json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import {MongoClient} from 'mongodb';

const server = express();
server.use(cors());
server.use(json());

let db = null;
const mongoClient = new MongoClient(process.env.MONGO_URI);
const promisse = mongoClient.connect();
promisse.then(() => { db = mongoClient.db()});

server.post("/participants", (req, res) => {

});
server.get("/participants", (req, res) => {

});

server.post("/messages", (req, res) => {

});
server.get("/messages", (req, res) => {

});

server.post("/status", (req, res) => {

});

server.listen(5000, () => {
    console.log("Servidor online! PORT:5000")
});