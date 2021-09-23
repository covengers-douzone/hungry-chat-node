const { Sequelize, DataTypes } = require('sequelize');

module.exports = function(sequelize){
    // foreign Key : (Participant)participant_no
    return sequelize.define('Chat', {
        no: {
            field: 'no',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        roomNo: {
            field: 'roomNo',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            field: 'type',
            type: DataTypes.ENUM('TEXT','IMG'),
            allowNull: false
        },
        createdAt: {
            field: 'createdAt',
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        낸: {
            field: 'contents',
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        notReadCount: {
            field: 'notReadCount',
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        underscored: false, // updateAt -> updateAt (underscored: update_at)
        freezeTableName: true,
        timestamps: true,
        createdAt: false,
        updatedAt: false,
        tableName: 'chat'
    });
}
