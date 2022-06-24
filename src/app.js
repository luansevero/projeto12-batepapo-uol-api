import express, { application, json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import {MongoClient} from 'mongodb';

let db = null;
const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient.connect(() => {
    db = mongoClient.db('');
});

const server = express();
server.use(cors());
server.use(json());

/* Participants Routes */

server.post("/participants", (req, res) => {

});
server.get("/participants", (req, res) => {

});

/* Messages Routes */

server.post("/messages", (req, res) => {

});
server.get("/messages", (req, res) => {

});

/* Status Routes */
server.post("/status", (req, res) => {

});

server.listen(5000, () => {
    console.log("Servidor online! PORT:5000")
});