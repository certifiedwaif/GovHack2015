import * as sequelize from 'sequelize';
import _ from "lodash";
import { StoryFactory } from './Story';
import { TwitterDataFactory } from './TwitterData';

// Default options
let seqOptions :sequelize.Options = {
    "database": process.env.DB_NAME || "typescript_test",
    "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASSWORD || "",
    "port": 3306,
    "dialect": "mysql",
    "logging": false,
    "define": {
        "underscored": true
    }
}

// Load options from config.json if one is provided
const env = process.env.NODE_ENV || 'development';
try {
    let configOptions = require(__dirname + '/../config/config.json');
    seqOptions = _.merge(seqOptions, configOptions);
} catch(e){ console.error("No config.json provided for Sequelize"); }

// Do NOT log your password on production!!!
if(env == 'development') { console.log("Initialising Sequelize with options:", seqOptions); }

// Initialise Sequelize 
export const dbConfig :sequelize.Sequelize = new sequelize.Sequelize(seqOptions);

// Initialise models
export const Story = StoryFactory(dbConfig)
export const TwitterData = TwitterDataFactory(dbConfig)

// Camera.belongsTo(Family);
// Family.hasMany(Camera);

