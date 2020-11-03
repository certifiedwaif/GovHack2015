"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterDataFactory = void 0;
const sequelize_1 = require("sequelize");
function TwitterDataFactory(sequelize) {
    return sequelize.define('TwitterData', {
        sourcename: {
            type: sequelize_1.DataTypes.STRING(44),
            unique: true
        },
        username: {
            type: sequelize_1.DataTypes.STRING(15),
            unique: true
        },
        description: sequelize_1.DataTypes.STRING(160)
    });
}
exports.TwitterDataFactory = TwitterDataFactory;
