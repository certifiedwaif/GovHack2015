"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryFactory = void 0;
const sequelize_1 = require("sequelize");
function StoryFactory(sequelize) {
    return sequelize.define('Story', {
        Title: sequelize_1.DataTypes.STRING(112),
        URL: {
            type: sequelize_1.DataTypes.STRING(118),
            unique: true
        },
        Date: sequelize_1.DataTypes.DATEONLY,
        Primary_image: sequelize_1.DataTypes.STRING(57),
        Primary_image_caption: sequelize_1.DataTypes.STRING(1061),
        Primary_image_rights_information: sequelize_1.DataTypes.STRING(150),
        Subjects: sequelize_1.DataTypes.STRING(364),
        Station: sequelize_1.DataTypes.STRING(36),
        State: sequelize_1.DataTypes.STRING(3),
        Place: sequelize_1.DataTypes.STRING(35),
        Keywords: sequelize_1.DataTypes.STRING(842),
        Latitude: sequelize_1.DataTypes.DECIMAL(10, 7),
        Longitude: sequelize_1.DataTypes.DECIMAL(10, 7),
        MediaRSS_URL: sequelize_1.DataTypes.STRING(127)
    }, {
        indexes: [
            {
                fields: ['Keywords']
            }
        ]
    });
}
exports.StoryFactory = StoryFactory;
