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