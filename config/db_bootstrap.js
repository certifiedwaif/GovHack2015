"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const seq = {
    Story: models_1.Story,
    TwitterData: models_1.TwitterData,
    sequelize: models_1.dbConfig
};
if (false) {
    seq.sequelize.sync({}).then(() => {
        models_1.Story.count().then(count => {
            if (count < 100) {
                fs_1.default.createReadStream(`${__dirname}/../data/localphotostories20092014csv.csv`)
                    .pipe(csv_parser_1.default())
                    .on('headers', (headers) => {
                    console.log(`Local Photo Stories csv headers: ${headers.join(", ")}`);
                }).on('data', (data) => {
                    const dates = data.Date.split("/");
                    data.Date = `${dates[2] - dates[1] - dates[0]}`;
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
                    models_1.Story.findOrCreate({
                        where: { URL: data.URL },
                        defaults: data
                    }).catch((error) => {
                        console.log(error.message);
                        console.log(data);
                    });
                });
            }
        });
        fs_1.default.createReadStream(`${__dirname}/../data/twitter_name_search.csv`)
            .pipe(csv_parser_1.default())
            .on('headers', headers => {
            console.log(`Twitter Data csv headers: ${headers.join(", ")}`);
        }).on('data', data => {
            models_1.TwitterData.findOrCreate({
                where: { username: data.username },
                defaults: data
            }).catch((error) => {
                console.log(error.message);
                console.log(data);
            });
        });
    });
}
function maxFieldSizes(csvPath) {
    const sizer = {};
    let count = 0;
    fs_1.default.createReadStream(csvPath)
        .pipe(csv_parser_1.default())
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
    }).on("end", () => {
        console.log(sizer);
        console.log("count", count);
    });
}
exports.seq = seq;
