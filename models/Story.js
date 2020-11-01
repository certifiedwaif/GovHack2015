"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryFactory = void 0;
const sequelize_1 = require("sequelize");
function StoryFactory(sequelize) {
    return sequelize.define("Story", {
        Title: sequelize_1.DataTypes.STRING(112),
        URL: {
            type: sequelize_1.DataTypes.STRING,
            unique: true
        },
        Date: sequelize_1.DataTypes.DATEONLY,
        Primary_image: sequelize_1.DataTypes.STRING(60),
        Primary_image_caption: sequelize_1.DataTypes.STRING(1070),
        Primary_image_rights_information: sequelize_1.DataTypes.STRING(160),
        Subjects: sequelize_1.DataTypes.STRING(370),
        Station: sequelize_1.DataTypes.STRING(40),
        State: sequelize_1.DataTypes.STRING(5),
        Place: sequelize_1.DataTypes.STRING(40),
        Keywords: sequelize_1.DataTypes.STRING(850),
        Latitude: sequelize_1.DataTypes.DECIMAL(11, 8),
        Longitude: sequelize_1.DataTypes.DECIMAL(11, 8),
        MediaRSS_URL: sequelize_1.DataTypes.STRING(127)
    });
}
exports.StoryFactory = StoryFactory;
