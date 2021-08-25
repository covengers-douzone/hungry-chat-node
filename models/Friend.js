const { Sequelize, DataTypes } = require('sequelize');

module.exports = function(sequelize){
    const friend = sequelize.define('Friend', {
    }, {
        underscored: false, // updateAt -> updateAt (underscored: update_at)
        freezeTableName: true,
        timestamps: true,
        createdAt: false,
        updatedAt: false,
        tableName: 'friend'
    });
    friend.removeAttribute('id');
    return friend;
}
