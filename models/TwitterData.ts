import { DataTypes, Sequelize } from 'sequelize'
import { TwitterDataStatic } from './models'

export function TwitterDataFactory (sequelize: Sequelize): TwitterDataStatic {
  return <TwitterDataStatic>sequelize.define('TwitterData', {
    sourcename: {
      type: DataTypes.STRING(44),
      unique: true
    },
    username: {
      type: DataTypes.STRING(15),
      unique: true
    },
    description: DataTypes.STRING(160)
  })
}
