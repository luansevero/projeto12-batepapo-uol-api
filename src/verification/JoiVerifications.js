import joi from "joi";

//Participants validation
function participantValidation(user){
    const participantSchema = joi.object({
        name: joi.string().min(1).trim().required(),
        lastStatus: joi.number()
    });
    const validation = participantSchema.validate(user);
    if(validation.error){
        return false
    };  return true
}

//Messages validation
function messagesValidation(message){
    const msg = {...message}
    msg.from = String(Boolean(msg.from))
    const messageSchema = joi.object({
        to: joi.string().required(),
        text: joi.string().required(),
        type: joi.string().valid('message', 'private_message').required(),
        from: joi.string().valid('true').required(),
        time: joi.string().min(1).trim().required()
    });
    const validation = messageSchema.validate(msg);
    if(validation.error){
        return false
    };  return true
}


export { participantValidation, messagesValidation }