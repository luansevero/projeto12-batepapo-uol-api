import express, { application, json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dayjs from 'dayjs'

dotenv.config();

import {MongoClient} from 'mongodb';
import { participantValidation, messagesValidation } from './components/JoiVerifications.js'


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
    if(!participantValidation(user)){return res.sendStatus(422);};
    try{
        const user = req.body;
        const participantCollection = db.collection('participante');

        const participant = await participantCollection.findOne({name: user});

        if(participant){return res.sendStatus(409);};

        await participantCollection.insertOne({
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
    } catch(error){
        res.send(500);
    } 
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
server.get("/messages", async (req, res) => {
    try {
    const limit = parseInt(req.query.limit);
    const user = req.headers.user;
    let allMessages = await db.collection('mesangens').find({}).toArray();
    if(limit){
       allMessages = messageLimit(allMessages, limit, user);
    };
    res.send(allMessages)
    mongoClient.close()
    } catch(error){
        res.sendStatus(500)
        mongoClient()
    };
});

/* Status Routes */

server.post("/status", async (req, res) => {
    
    try{
        const user = req.headers.user;
        const participantCollection = db.collection('participante');
        const participant = await participantCollection.findOne({ name: user});

        if(!participant){
            res.sendStatus(404)
        } 

        await participantCollection.updateOne(
            {name: user},
            {$set:{
                name: user,
                laststatus: DateNow()
            }
        })
        res.sendStatus(200);
    } catch(error){
        res.sendStatus(500);
    }

});

server.listen(5000, () => {
    console.log("Servidor online! PORT:5000")
});