import dayjs from "dayjs";
import mongoClient from '../database/mongo.js';
import { messagesValidation } from '../components/JoiVerifications.js'

async function postMessage(req, res){
    const user = req.headers.user

    await mongoClient.connect();
    const db = mongoClient.db('bate_papo_uol');
    const participantCollection = db.collection('participante');

    const participant = participantCollection.findOne({name: user});

    const message = {...req.body, from: participant, time:dayjs().format('HH:mm:ss') };

    if(!messagesValidation(message)){return res.sendStatus(422)};

    try{
        message.from = user;

        const messageCollection = db.collection('mensagens');
        
        await messageCollection.insertOne(message);
        
        return res.sendStatus(201);
    } catch {
        return res.sendStatus(500);
    }
}

async function allMessages(req,res){
    await mongoClient.connect();
    const db = mongoClient.db('bate_papo_uol');
    const messageCollection = db.collection('mensagens');

    try{

    }

}

export { postMessage }