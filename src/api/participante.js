import dayjs from "dayjs";
import { strict as assert } from 'assert';
import { stripHtml } from "string-strip-html";
import mongoClient from '../database/mongo.js';
import { participantValidation } from '../verification/JoiVerifications.js'


async function login(req,res){
    const participant = {...req.body, lastStatus: Date.now()};
    if(!participantValidation(participant)){return res.sendStatus(422)};

    await mongoClient.connect();
    const db = mongoClient.db('bate_papo_uol');

    const participantCollection = db.collection('participante');
    
    const isLoggedIn = await participantCollection.findOne({name: participant.name});
    if(isLoggedIn){return res.sendStatus(409)};
    try{
        await participantCollection.insertOne(participant);
        await db.collection('mensagens').insertOne({
            from: participant.name,
            to: 'Todos',
            text: 'entra na sala...',
            type: 'status',
            time: dayjs().format('HH:mm:ss')
        })
        return res.sendStatus(201);
    } catch (error){
        return res.sendStatus(422);
        
    } 
} // Testado e funcionando

async function allOnlineUsers(req,res){
    await mongoClient.connect();
    const db = mongoClient.db('bate_papo_uol');
    const participantCollection = db.collection('participante');

    try{
        const participants =  await participantCollection.find().toArray();
        return res.send(participants)
    } catch(error){
        return res.sendStatus(500);
    }
    
}



export { login, allOnlineUsers }

