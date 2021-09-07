const { Sequelize, DataTypes } = require('sequelize');

module.exports = function(sequelize){
    const friend = sequelize.define('Friend', {
        userNo:{
            field: 'userNo',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: false,
            allowNull: false
        },
        friendNo:{
            field: 'friendNo',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: false,
            allowNull: false
        },
    }, {
        underscored: false, // updateAt -> updateAt (underscored: update_at)
        freezeTableName: true,
        timestamps: true,
        createdAt: false,
        updatedAt: false,
        tableName: 'friend'
    });
    //friend.removeAttribute('id');
    return friend;
}
