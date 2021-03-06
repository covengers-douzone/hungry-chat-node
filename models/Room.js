const { Sequelize, DataTypes } = require('sequelize');

module.exports = function(sequelize){
    return sequelize.define('Room', {
        no: {
            field: 'no',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            field: 'title',
            type: DataTypes.STRING(45),
            allowNull: false
        },
        content: {
            field: 'content',
            type: DataTypes.STRING(100),
            allowNull: true
        },
        password: {
            field: 'password',
            type: DataTypes.STRING(45),
            allowNull: true
        },
        type: {
            field: 'type',
            type: DataTypes.ENUM('private', 'public' , 'official'),
            allowNull: false
        },
        createdAt: {
            field: 'createdAt',
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        headCount: {
            field: 'headCount',
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
    }, {
        underscored: false, // updateAt -> updateAt (underscored: update_at)
        freezeTableName: true,
        timestamps: true,
        createdAt: false,
        updatedAt: false,
        tableName: 'room'
    });
}
