const users = [];
const unknowns = [];
// Join user to chat
function userJoin(id, username,room,participantNo ,userNo){
    const user = {id, username,room,participantNo , userNo};

    users.push(user);

    return user;
}

function unknownJoin (id , userNo){
    const unknown = {id , userNo}
    unknowns.push(unknown)

    return unknown
}

// Get current user
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

// Get current user
function getCurrentUnknown(userNo){
    return unknowns.find(user => user.userNo === userNo);
}

// User leaves chat
function userLeave(id){
    const index = users.findIndex(user => user.id === id);
    if(index !== -1){
        return users.splice(index,1)[0];
    }
}

// User leaves chat
function unknownLeave(id){
    const index = unknowns.findIndex(unknown => unknown.id === id);
    if(index !== -1){
        return unknowns.splice(index,1)[0];
    }
}

// Get room users
function getRoomUsers(room){
    return users.filter(user => user.room === room)
}

module.exports = {userJoin, unknownJoin ,unknownLeave, getCurrentUnknown, getCurrentUser, userLeave, getRoomUsers};