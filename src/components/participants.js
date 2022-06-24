function isLoggedIn(user, participants){
    return participants.some(participant => participant.to == user)
}

export { isLoggedIn }