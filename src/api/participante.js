import dayjs from "dayjs";
import mongoClient from '../database/mongo.js';
import { participantValidation } from '../components/JoiVerifications.js'


async function login(req,res){
    const user = {...req.body, lastStatus: Date.now()};
    if(!participantValidation(user)){return res.sendStatus(422)};

    await mongoClient.connect();
    const db = mongoClient.db('bate_papo_uol');

    const participantCollection = db.collection('participante');
    
    const isLoggedIn = await participantCollection.findOne({name: user});
    if(isLoggedIn){return res.sendStatus(409)};
    try{
        await participantCollection.insertOne(user);
        await db.collection('mensagem').insertOne({
            from: user.name,
            to: 'Todos',
            text: 'entra na sala...',
            type: 'status',
            time: dayjs().format('HH:mm:ss')
        })
        return res.send(201);
    } catch (error){
        return res.send(422);
    } 
}

async function allOnlineUsers(req,res){
    await mongoClient.connect();
    const db = mongoClient.db('bate_papo_uol');

    const participantCollection = db.collection('participante');
    const participants = participantCollection.find().toArray();

    return res.send(participants)
}

export { login, allOnlineUsers }

