"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seq = void 0;
const models_1 = require("../models");
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const seq = {
    Story: models_1.Story,
    TwitterData: models_1.TwitterData,
    Town: models_1.Town,
    sequelize: models_1.dbConfig
};
exports.seq = seq;
if (false) {
    seq.sequelize.sync({
        force: true
    }).then(() => {
        console.log("Sequelize import from db_bootstrap starting");
        fs_1.default.createReadStream(path_1.default.resolve(__dirname, '..', 'data', 'small_town_data.csv'))
            .pipe((0, csv_parser_1.default)())
            .on('headers', headers => {
            console.log(`Small Town Data csv headers: ${headers.join(', ')}`);
        }).on('data', data => {
            console.log("Loading town:", data.Place);
            models_1.Town.create(data).catch((error) => {
                console.log(error.message);
                console.log(data);
            }).then(d => {
            });
        });
        models_1.Story.count().then(count => {
            if (count < 100) {
                fs_1.default.createReadStream(path_1.default.resolve(__dirname, '..', 'data', 'localphotostories20092014csv.csv'))
                    .pipe((0, csv_parser_1.default)())
                    .on('headers', (headers) => {
                    console.log(`Local Photo Stories csv headers: ${headers.join(', ')}`);
                }).on('data', (data) => {
                    const dates = data.Date.split('/');
                    data.Date = `${dates[2]}-${('0' + dates[1]).slice(-2)}-${('0' + dates[0]).slice(-2)}`;
                    data.Primary_image = data['Primary image'];
                    data.Primary_image_caption = data['Primary image caption'];
                    data.Primary_image_rights_information = data['Primary image rights information'];
                    data.MediaRSS_URL = data['MediaRSS URL'];
                    data.Latitude = data.Latitude || null;
                    data.Longitude = data.Longitude || null;
                    delete data['Primary image'];
                    delete data['Primary image caption'];
                    delete data['Primary image rights information'];
                    delete data['MediaRSS URL'];
                    models_1.Story.create(data)
                        .catch((error) => {
                        console.log(error.message);
                        console.log(data);
                    });
                });
            }
        });
        fs_1.default.createReadStream(path_1.default.resolve(__dirname, '..', 'data', 'twitter_name_search.csv'))
            .pipe((0, csv_parser_1.default)())
            .on('headers', headers => {
            console.log(`Twitter Data csv headers: ${headers.join(', ')}`);
        }).on('data', data => {
            models_1.TwitterData.create(data)
                .catch((error) => {
                console.log(error.message);
                console.log(data);
            });
        });
    });
}
function inspectCSV(csvPath) {
    const sizer = {};
    let count = 0;
    let example = [];
    fs_1.default.createReadStream(csvPath)
        .pipe((0, csv_parser_1.default)())
        .on('headers', (headers) => {
        headers.forEach(header => {
            sizer[header] = 0;
        });
    }).on('data', (data) => {
        Object.keys(data).forEach(col => {
            if (data[col].length > sizer[col])
                sizer[col] = data[col].length;
        });
        count++;
        if (example.length === 0)
            example = data;
    }).on('end', () => {
        console.log('Row count:', count);
        console.log('Column Names, Max Length, Example Entry');
        Object.keys(sizer).forEach(key => {
            console.log(`${key}: \x1b[33m${sizer[key]}\x1b[0m, \x1b[32m'${example[key]}'\x1b[0m`);
        });
    });
}
