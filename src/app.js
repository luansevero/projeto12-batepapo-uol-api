import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import {MongoClient} from 'mongodb';

import { login, allOnlineUsers}  from './api/participante.js'
import { postMessage, allMessages, deleteMessage, editMessage } from './api/mensagem.js'
import { userStatus } from './api/status.js'


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
server.post("/messages", (req, res) => postMessage(req,res));
server.get("/messages", async (req, res) => allMessages(req,res));
server.delete("/messages/:ID_DA_MENSAGEM", async (req, res) => deleteMessage(req,res));
server.put("/messages/:ID_DA_MENSAGEM", async (req, res) => editMessage(req,res));

/* Status Routes */

server.post("/status", async (req, res) => userStatus(req,res));

server.listen(5000, () => {
    console.log("Servidor online! PORT:5000")
});