import express, { application, json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import {MongoClient} from 'mongodb';
import { participantValidation } from './components/JoiVerifications.js'
import { participants, isUsernameAvailible } from './components/participants.js'

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
    const user = req.body;
    if(!participantValidation(user)){return res.sendStatus(422);};
    if(isUsernameAvailible(user)){return res.sendStatus(409);};
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