import { DataTypes, Sequelize } from 'sequelize';
import { TwitterDataStatic } from './models';

export function TwitterDataFactory(sequelize: Sequelize): TwitterDataStatic {
    return <TwitterDataStatic>sequelize.define("TwitterData", {
        sourcename: DataTypes.STRING(44),
        username: {
            type: DataTypes.STRING(15),
            unique: true
        },
        description: DataTypes.STRING(160)
    });
}
