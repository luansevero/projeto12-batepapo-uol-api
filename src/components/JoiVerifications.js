import joi from "joi";

//Participants validation

function participantValidation(user){
    const participantSchema = joi.object({
        name: joi.string().required()
    });
    const validation = participantSchema.validate(user);
    if(validation.error){
        return false
    } return true
}

//Messages validation


//Status validation


export { participantValidation }