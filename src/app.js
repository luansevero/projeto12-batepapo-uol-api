import express, { application, json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dayjs from 'dayjs'

dotenv.config();

import {MongoClient} from 'mongodb';
import { participantValidation, messagesValidation } from './components/JoiVerifications.js'
import { participants, isUsernameAvailible } from './components/participants.js'

let db = null;
const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient.connect(() => {
    db = mongoClient.db('bate-papo-uol');
});

const server = express();
server.use(cors());
server.use(json());

/* Participants Routes */

server.post("/participants", async (req, res) => {
    const user = req.body;
    if(!participantValidation(user)){return res.sendStatus(422);};
    if(isUsernameAvailible(user)){return res.sendStatus(409);};
    await db.collection('participante').insertOne({
        name: user,
        laststatus: DateNow()
    });
    await db.collection('mensagem').insertOne({
        from: user,
        to: 'Todos',
        text: 'entra na sala...',
        type: 'status',
        time: dayjs().format('HH:mm:ss')
    })
    res.sendStatus(201);
});
server.get("/participants", (req, res) => {
    db.collection('participante').find().toArray().then(participants => {
        res.send(participants)
    })
});

/* Messages Routes */

server.post("/messages", (req, res) => {
    const message = req.body;
    if(messagesValidation(message)){return res.sendStatus(422);};
    message.time = dayjs().format('HH:mm:ss')
    db.collection('mensagens').insertOne(message);
    res.sendStatus(201);
});
server.get("/messages", (req, res) => {

});

/* Status Routes */
server.post("/status", (req, res) => {

});

server.listen(5000, () => {
    console.log("Servidor online! PORT:5000")
});