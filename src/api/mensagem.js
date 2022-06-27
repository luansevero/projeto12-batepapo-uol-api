import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import mongoClient from '../database/mongo.js';
import { messagesValidation } from '../verification/JoiVerifications.js'

async function postMessage(req, res){
    const { user } = req.headers

    await mongoClient.connect();
    const db = mongoClient.db('bate_papo_uol');
    const participantCollection = db.collection('participante');

    const participant = await participantCollection.findOne({name: user});

    const message = {...req.body, from: String(participant), time:dayjs().format('HH:mm:ss') };
    
    if(!messagesValidation(message)){
        return res.sendStatus(422)};

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
    const { limit } = parseInt(req.query);
    const { user } = req.headers;
    try{
        await mongoClient.connect();
        const db = mongoClient.db('bate_papo_uol');
        const messageCollection = db.collection('mensagens');

        let allMessages = await messageCollection.find({}).toArray();
        allMessages = await allUserMessages(allMessages, limit, user);
        return res.send(allMessages);
    } catch(error){
        return res.sendStatus(500);
    }
}

function allUserMessages(messages, limit, user){
    let allMessages = messages.filter(message => {
        if(message.type == 'private_message'){
            if(message.to == user){
                return message
            }
        } else {
            return message
        }
    })
    if(limit){
        return messageLimit(allMessages, limit)
    } return allMessages
    
}
function messageLimit(allMessages, limit){
    return allMessages.slice(allMessages.length - limit, allMessages.length)
}

async function deleteMessage(req, res){
    const { user } = req.headers;
    const { ID_DA_MENSAGEM } = req.params;

    try{
        await mongoClient.connect();
        const db = mongoClient.db('bate_papo_uol');
        const messageCollection = db.collection('mensagens');
        
        const message = await messageCollection.findOne({ _id: new ObjectId(ID_DA_MENSAGEM) });
        if(!message){return res.sendStatus(404)};
        if(message.from !== user){return res.sendStatus(401)};

        await messageCollection.deleteOne({ _id: new ObjectId(ID_DA_MENSAGEM) });
        
    } catch(error){
        res.sendStatus(500);
    }
}

async function editMessage(req, res){
    const { user } = req.headers
    const message = {...req.body, from: String(user), time: dayjs().format('HH:mm:ss') };
    const { ID_DA_MENSAGEM } = req.params;

    if(!messagesValidation(message)){return res.sendStatus(422)};

    try{
        await mongoClient.connect();
        const db = mongoClient.db('bate_papo_uol');
        const messageCollection = db.collection('mensagens');
        const selectMessage = await messageCollection.findOne({ _id: new ObjectId(ID_DA_MENSAGEM) });
        if(!selectMessage){return res.sendStatus(404)};
        if(selectMessage.from !== user){return res.sendStatus(401)};
        console.log(message)
        await messageCollection.updateOne({ _id: new ObjectId(ID_DA_MENSAGEM) }, {$set: message});
    } catch(error){
        console.log(error)
        return res.sendStatus(500);
    }
}

export { postMessage, allMessages, deleteMessage, editMessage }