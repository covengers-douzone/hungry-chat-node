const { Sequelize, DataTypes } = require('sequelize');

module.exports = function(sequelize){
    // foreign Key : (Room)room_no
    return sequelize.define('Calendar', {
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
        title: {
            field: 'title',
            type: DataTypes.STRING(100),
            allowNull: false
        },
        start: {
            field: 'start',
            type: DataTypes.STRING(50),
            // type: DataTypes.DATE,
            allowNull: false,
        },
        end: {
            field: 'end',
            type: DataTypes.STRING(50),
            // type: DataTypes.DATE,
            allowNull: false
        },

    }, {
        underscored: false, // updateAt -> updateAt (underscored: update_at)
        freezeTableName: true,
        timestamps: true,
        createdAt: false,
        updatedAt: false,
        tableName: 'calendar'
    });
}
