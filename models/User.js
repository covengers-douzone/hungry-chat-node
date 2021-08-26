const { Sequelize, DataTypes } = require('sequelize');

module.exports = function(sequelize){
    return sequelize.define('User', {
        no: {
            field: 'no',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        username: {
            field: 'username',
            type: DataTypes.STRING(45),
            allowNull: false
        },
        name: {
            field: 'name',
            type: DataTypes.STRING(45),
            allowNull: false
        },
        phoneNumber: {
            field: 'phoneNumber',
            type: DataTypes.STRING(11),
            allowNull: false
        },
        password: {
            field: 'password',
            type: DataTypes.TEXT,
            allowNull: false
        },
        isDeleted: {
            field: 'isDeleted',
            type: DataTypes.TINYINT,
            allowNull: false
        },
        backgroundImageUrl: {
            field: 'backgroundImageUrl',
            type: DataTypes.TEXT,
            allowNull: false
        },
        profileImageUrl: {
            field: 'profileImageUrl',
            type: DataTypes.TEXT,
            allowNull: false
        },
        role: {
            field: 'role',
            type: DataTypes.ENUM('ROLE_USER', 'ROLE_ADMIN','ROLE_UNKNOWN'),
            allowNull: false
        },
        token: {
            field: 'token',
            type: DataTypes.TEXT,
            allowNull: true
        },
        createdAt: {
            field: 'createdAt',
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        lastLoginAt: {
            field: 'lastLoginAt',
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.NOW
        },
        nickname: {
            field: 'nickname',
            type: DataTypes.STRING(45),
            allowNull: true
        },
    }, {
        underscored: false, // updateAt -> updateAt (underscored: update_at)
        freezeTableName: true,
        timestamps: true,
        createdAt: false,
        updatedAt: false,
        tableName: 'user'
    });
}
