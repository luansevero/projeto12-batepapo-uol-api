import dayjs from "dayjs";
import mongoClient from '../database/mongo.js';
import { messagesValidation } from '../components/JoiVerifications.js'

async function postMessage(req, res){
    const { user } = req.headers

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
        const { limit } = parseInt(req.query);
        const { user } = req.headers;

        let allMessages = await messageCollection.find({}).toArray();

        if(limit){
             allMessages = await messageLimit(allMessages, limit, user)
        }

        return res.send(allMessages);
    } catch(error){
        return res.sendStatus(500);
    }

}

function messageLimit(messages, limit, user){
    let onlyUserMessages = messages.filter(message => {
        if(message.type == 'private_message'){
            if(message.to == user){
                return message
            }
        } else {
            return message
        }
    })
    return onlyUserMessages.slice(onlyUserMessages.length - limit, onlyUserMessages.length)
}

async function deleteMessage(req, res){
    await mongoClient.connect();
    const db = mongoClient.db('bate_papo_uol');
    const messageCollection = db.collection('mensagens');

    try{
        const { user } = req.headers;
        const { ID_DA_MENSAGEM } = req.params;
        
        const message = await messageCollection.findOne({ _id: ID_DA_MENSAGEM });

        if(!message){return res.sendStatus(404)};
        if(message.name !== user){return res.sendStatus(401)};

        await messageCollection.deleteOne({ _id: ID_DA_MENSAGEM });

    } catch(error){
        res.sendStatus(500);
    }
}

export { postMessage, allMessages, deleteMessage }