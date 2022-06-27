import dayjs from "dayjs";
import mongoClient from '../database/mongo.js';

async function userStatus(req, res){
    
    const { user } = req.headers;

    try{
        await mongoClient.connect();
        const db = mongoClient.db('bate_papo_uol');
        const participantCollection = db.collection('participante');
        const participant = { name: user, lastStatus: Date.now() };

        const status = await participantCollection.findOne({ name: user });
        if(!status){return res.sendStatus(404)};

        await participantCollection.updateOne({name: user}, { $set: participant});
        return res.sendStatus(200);
    } catch(error){
        return res.sendStatus(500);
    }
}

const FIFTEEN_SECONDS = 15000
setInterval(stillLoggedIn, FIFTEEN_SECONDS);

async function stillLoggedIn(){
    const TEN_SECONDS = 10000;
    await mongoClient.connect();
    const db = mongoClient.db('bate_papo_uol');
    const participantCollection = db.collection('participante');
    const messageCollection = db.collection('mensagens');

    try{
        let timeout = Date.now() - TEN_SECONDS;

        const allParticipants = await participantCollection.find().toArray();

        allParticipants.map(participant => {
            if(participant.lastStatus < timeout){
                participantCollection.deleteOne({ name: participant.name})
                messageCollection.insertOne({
                    from: participant.name,
                    to: 'Todos',
                    text: 'sai da sala...',
                    type: 'status',
                    time: dayjs().format('HH:mm:ss')
                });
            }
        })
    }catch(error){
        console.log(error)
    }
}

export { userStatus, stillLoggedIn}