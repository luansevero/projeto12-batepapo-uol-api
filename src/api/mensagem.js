import dayjs from "dayjs";
import mongoClient from '../database/mongo.js';
import { messagesValidation } from '../components/JoiVerifications.js'

async function x(req, res){
    const message = {...req.body, from: req.headers.user}
}

export { x }