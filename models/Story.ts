import { DataTypes, Sequelize } from 'sequelize';
import { StoryStatic } from './models';

export function StoryFactory(sequelize: Sequelize): StoryStatic {
    return <StoryStatic>sequelize.define("Story", {
        Title: DataTypes.STRING(112),
        URL: {
            type: DataTypes.STRING,
            unique: true
        },
        Date: DataTypes.DATEONLY,
        Primary_image: DataTypes.STRING(60),
        Primary_image_caption: DataTypes.STRING(1070),
        Primary_image_rights_information: DataTypes.STRING(160),
        Subjects: DataTypes.STRING(370),
        Station: DataTypes.STRING(40),
        State: DataTypes.STRING(5),
        Place: DataTypes.STRING(40),
        Keywords: DataTypes.STRING(850),
        Latitude: DataTypes.DECIMAL(11,8),
        Longitude: DataTypes.DECIMAL(11,8),
        MediaRSS_URL: DataTypes.STRING(127)
    });
}
/*
max sizes of each field, using maxFieldSizes():
{
  Title: 112,
  URL: 118,
  Date: 10,
  'Primary image': 57,
  'Primary image caption': 1061,
  'Primary image rights information': 150,
  Subjects: 364,
  Station: 36,
  State: 3,
  Place: 35,
  Keywords: 842,
  Latitude: 11,
  Longitude: 11,
  'MediaRSS URL': 127
}
*/