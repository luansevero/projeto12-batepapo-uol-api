import express, { application, json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dayjs from 'dayjs'

dotenv.config();

import {MongoClient} from 'mongodb';
import { participantValidation, messagesValidation } from './components/JoiVerifications.js'
import { login, allOnlineUsers }  from './api/participante.js'


let db = null;
const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient.connect(() => {
    db = mongoClient.db('bate-papo-uol');
});

const server = express();
server.use(cors());
server.use(json());

/* Participants Routes */

server.post("/participants", async (req, res) => login(req,res));
server.get("/participants", (req, res) => allOnlineUsers(req,res));

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
    let allMessages = await db.collection('mensagens').find({}).toArray();
    if(limit){
       allMessages = messageLimit(allMessages, limit, user);
    };
    res.send(allMessages)
    } catch(error){
        res.sendStatus(500)
    };
});
server.delete("/messages/:ID_DA_MENSAGEM", async (req, res) => {
    try{
        const { user }  = req.headers;
        const { ID_DA_MENSAGEM } = req.params;
        const messageCollection = db.collection('mensagens')
        const message = messageCollection.findOne({ _id: new Object(ID_DA_MENSAGEM)});
        if(!message){
            return res.sendStatus(404);
        };
        if(message.name !== user){
            return res.sendStatus(401);
        }
        await messageCollection.deleteOne({ _id: new Object(ID_DA_MENSAGEM)});
        res.sendStatus(200)
    } catch (error){
        res.sendStatus(500);
    }
});
server.put("/messages/:ID_DA_MENSAGEM", async (req, res) => {
        const { user }  = req.headers;
        const message = req.body;
        if(messagesValidation(message)){return res.sendStatus(422);};
        message.time = dayjs().format('HH:mm:ss')
        db.collection('mensagens').insertOne(message);
    try{
        const { ID_DA_MENSAGEM } = req.params;
        const messageCollection = db.collection('mensagens')
        const message = messageCollection.findOne({ _id: new Object(ID_DA_MENSAGEM)});
        if(!message){
            return res.sendStatus(404);
        };
        if(message.name !== user){
            return res.sendStatus(401);
        }
        await messageCollection.deleteOne({ _id: new Object(ID_DA_MENSAGEM)});
        res.sendStatus(200)
    } catch (error){
        res.sendStatus(500);
    }
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