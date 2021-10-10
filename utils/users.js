const participants = [];
const unknowns = [];
const users = [];

function userJoin(id,userLocalStorage){
    const user = {id, userLocalStorage};

    users.push(user);

    return user;
}

// Join participant to chat
function participantJoin(id, username,room,participantNo ,userNo){
    const user = {id, username,room,participantNo , userNo};

    participants.push(user);

    return user;
}

function unknownJoin (id , userNo){
    const unknown = {id , userNo}
    unknowns.push(unknown)

    return unknown
}

// Get current participant
function getCurrentParticipant(id){
    return participants.find(participant => participant.id === id);
}

// Get current user
function getCurrentUnknown(userNo){
    return unknowns.find(user => user.userNo === userNo);
}

// user leaves chat
function userLeave(id){
    const index = users.findIndex(user => user.id === id);
    if(index !== -1){
        return users.splice(index,1)[0];
    }
}

// participant leaves chat
function participantLeave(id){
    const index = participants.findIndex(participant => participant.id === id);
    if(index !== -1){
        return participants.splice(index,1)[0];
    }
}

// User leaves chat
function unknownLeave(id){
    const index = unknowns.findIndex(unknown => unknown.id === id);
    if(index !== -1){
        return unknowns.splice(index,1)[0];
    }
}

// Get room participant
function getRoomParticipants(room){
    return participants.filter(participant => participant.room === room)
}

function getUserNoParticipants(userNo){
    return participants.filter(participant => participant.userNo === userNo)
}

// Get room participant
function getUsers(){
    return users;
}

module.exports = {userJoin, participantJoin, unknownJoin ,unknownLeave, getCurrentUnknown, getCurrentParticipant,
    getUserNoParticipants , participantLeave, getRoomParticipants, getUsers, userLeave};