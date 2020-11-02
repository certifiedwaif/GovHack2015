import { DataTypes, Sequelize } from 'sequelize';
import { StoryStatic } from './models';

export function StoryFactory(sequelize: Sequelize): StoryStatic {
    return <StoryStatic>sequelize.define("Story", {
        Title: DataTypes.STRING(112),
        URL: {
            type: DataTypes.STRING(118),
            unique: true
        },
        Date: DataTypes.DATEONLY,
        Primary_image: DataTypes.STRING(57),
        Primary_image_caption: DataTypes.STRING(1061),
        Primary_image_rights_information: DataTypes.STRING(150),
        Subjects: DataTypes.STRING(364),
        Station: DataTypes.STRING(36),
        State: DataTypes.STRING(3),
        Place: DataTypes.STRING(35),
        Keywords: DataTypes.STRING(842),
        Latitude: DataTypes.DECIMAL(10,7),
        Longitude: DataTypes.DECIMAL(10,7),
        MediaRSS_URL: DataTypes.STRING(127)
    });
}
