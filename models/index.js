const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        timezone: "+09:00",
        dialectOptions: {
            charset: 'utf8mb4',
            dateStrings: true,
            typeCast: true
        },
        dialect: 'mysql'
    }
);

const Room = require('./Room')(sequelize);
const User = require('./User')(sequelize);
const Participant = require('./Participant')(sequelize);
const Chat = require('./Chat')(sequelize);
const Friend = require('./Friend')(sequelize);
const Calendar = require('./Calendar')(sequelize);


// Room : Participant = 1 : N
Room.hasMany(Participant, {
    foreignKey: {
        name: 'roomNo',
        allowNull: false,
        constraints: false,
        onDelete: 'cascade'
    }
});
Participant.belongsTo(Room, {
    foreignKey: 'roomNo'
});

// Room : Calendar = 1 : N
Room.hasMany(Calendar, {
    foreignKey: {
        name: 'roomNo',
        allowNull: false,
        constraints: false,
        onDelete: 'cascade'
    }
});
Calendar.belongsTo(Room, {
    foreignKey: 'roomNo'
});

// // User : Participant = 1 : N
User.hasMany(Participant, {
    foreignKey: {
        name: 'userNo',
        allowNull: false,
        constraints: false,
        onDelete: 'cascade'
    }
});
Participant.belongsTo(User, {
    foreignKey: 'userNo'
});

// Participant : Chat = 1 : N
Participant.hasMany(Chat, {
    foreignKey: {
        name: 'participantNo',
        allowNull: false,
        constraints: false,
        onDelete: 'cascade'
    }
});
Chat.belongsTo(Participant, {
    foreignKey: 'participantNo'
});

// User : Friend = 1 : N
User.hasMany(Friend, {
    foreignKey: {
        name: 'userNo',
        allowNull: false,
        constraints: false,
        onDelete: 'cascade'
    }
});
Friend.belongsTo(User, {
    foreignKey: 'userNo'
});

User.hasMany(Friend, {
    foreignKey: {
        name: 'friendNo',
        allowNull: false,
        constraints: false,
        onDelete: 'cascade'
    }
});
Friend.belongsTo(User, {
    foreignKey: 'friendNo'
});

Room.sync({
    force: process.env.TABLE_CREATE_ALWAYS === 'true', // true : (drop) table 데이터 없어질 수 있음
    alter: process.env.TABLE_ALTER_SYNC === 'true'     // 개발 끝나면 false로 하기
})
User.sync({
    force: process.env.TABLE_CREATE_ALWAYS === 'true', // true : (drop) table 데이터 없어질 수 있음
    alter: process.env.TABLE_ALTER_SYNC === 'true'     // 개발 끝나면 false로 하기
})
Chat.sync({
    force: process.env.TABLE_CREATE_ALWAYS === 'true', // true : (drop) table 데이터 없어질 수 있음
    alter: process.env.TABLE_ALTER_SYNC === 'true'     // 개발 끝나면 false로 하기
})
Participant.sync({
    force: process.env.TABLE_CREATE_ALWAYS === 'true', // true : (drop) table 데이터 없어질 수 있음
    alter: process.env.TABLE_ALTER_SYNC === 'true'     // 개발 끝나면 false로 하기
})
Friend.sync({
    force: process.env.TABLE_CREATE_ALWAYS === 'true', // true : (drop) table 데이터 없어질 수 있음
    alter: process.env.TABLE_ALTER_SYNC === 'true'     // 개발 끝나면 false로 하기
})
Calendar.sync({
    force: process.env.TABLE_CREATE_ALWAYS === 'true', // true : (drop) table 데이터 없어질 수 있음
    alter: process.env.TABLE_ALTER_SYNC === 'true'     // 개발 끝나면 false로 하기
})

module.exports = {sequelize, Chat, Participant, Room, User, Friend, Calendar};
