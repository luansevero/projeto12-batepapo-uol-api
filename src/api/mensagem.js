import dayjs from "dayjs";
import mongoClient from '../database/mongo.js';
import { participantValidation } from '../components/JoiVerifications.js'


export default function userLogin(req,res){
    const user = {...req.body};
    if(!participantValidation(user)){return res.sendStatus(422)};

    await mongoClient.connect();
    const db = client.db('uol');

    const participantCollection = db.collection('participante');
    
    const isLoggedIn = await participantCollection.findOne({name: user});
    if(isLoggedIn){return res.sendStatus(409)};

    
}



/*
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
*/