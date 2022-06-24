const participants = [];

function isUsernameAvailible(user){
    if(participants.contains(user)){
        return true
    } return false
}

export { participants, isUsernameAvailible }