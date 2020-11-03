"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const models_1 = require("../models");
const lodash_1 = __importDefault(require("lodash"));
const sequelize_1 = require("sequelize");
const http_1 = __importDefault(require("http"));
const xml2js_1 = require("xml2js");
const mustache = require("mustache");
const config = {
    domains: ['localstories.info', 'www.localstories.info', 'truestories.david-ma.net', 'govhack2015.david-ma.net'],
    controllers: {
        '': function homepage(router) {
            router.readAllViews(views => {
                const output = mustache.render(views.index, {}, views);
                router.res.end(output);
            });
        }
    },
    services: {
        requestjson: function (response, request, db, d) {
            const storyOptions = {
                Latitude: { [sequelize_1.Op.ne]: null },
                Longitude: { [sequelize_1.Op.ne]: null },
                Primary_image: { [sequelize_1.Op.ne]: '' }
            };
            if (d && !isNaN(d))
                storyOptions.id = d;
            models_1.Story.findOne({
                where: storyOptions,
                order: models_1.Story.sequelize.random()
            }).then(story => {
                const byline = story.Primary_image_rights_information.match(/Byline: (.*)/);
                const source = byline ? byline[1] || 'ABC' : 'ABC';
                const promises = [
                    findNearestTown(story),
                    models_1.TwitterData.findOne({
                        where: {
                            sourcename: source
                        }
                    }),
                    findBestImages(story.MediaRSS_URL, story.Primary_image)
                ];
                Promise.all(promises).then(([town, twitterData, bestImages]) => {
                    const result = {};
                    if (twitterData)
                        lodash_1.default.merge(result, twitterData.toJSON());
                    lodash_1.default.merge(result, town.toJSON());
                    lodash_1.default.merge(result, story.toJSON());
                    result.bestImage = bestImages[0];
                    result.bestImages = bestImages;
                    response.end(JSON.stringify(result));
                });
            }).catch(err => {
                console.log('Error in story requestjson', err);
                response.end(err);
            });
        }
    }
};
exports.config = config;
function findNearestTown(story, size = 1) {
    return new Promise(function (resolve) {
        models_1.Town.findOne({
            where: {
                Place: story.Place
            }
        }).then(town => {
            if (town) {
                resolve(town);
            }
            else {
                const target = {
                    lat: [(story.Latitude - size), (story.Latitude + size)],
                    long: [(story.Longitude - size), (story.Longitude + size)]
                };
                models_1.Town.findAll({
                    where: {
                        Latitude: {
                            [sequelize_1.Op.between]: target.lat
                        },
                        Longitude: {
                            [sequelize_1.Op.between]: target.long
                        }
                    }
                }).then(towns => {
                    if (towns.length === 0) {
                        findNearestTown(story, size + 1).then(resolve);
                    }
                    else if (towns.length === 1) {
                        resolve(towns[0]);
                    }
                    else {
                        let closestTown = null;
                        let closest = 9999999999;
                        towns.forEach(town => {
                            const calcDist = distance(story.Latitude, story.Longitude, town.Latitude, town.Longitude, 'K');
                            if (calcDist < closest) {
                                closestTown = town;
                                closest = calcDist;
                            }
                        });
                        resolve(closestTown);
                    }
                });
            }
        });
    });
}
function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 === lat2) && (lon1 === lon2)) {
        return 0;
    }
    else {
        const radlat1 = Math.PI * lat1 / 180;
        const radlat2 = Math.PI * lat2 / 180;
        const theta = lon1 - lon2;
        const radtheta = Math.PI * theta / 180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit === 'K') {
            dist = dist * 1.609344;
        }
        if (unit === 'N') {
            dist = dist * 0.8684;
        }
        return dist;
    }
}
function findBestImages(mediaXmlUrl, primaryImage) {
    return new Promise((resolve) => {
        http_1.default.get(mediaXmlUrl, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                xml2js_1.parseString(data, (err, result) => {
                    if (err)
                        resolve([primaryImage]);
                    try {
                        const items = result.rss.channel[0].item;
                        const bestImages = [];
                        items.forEach(item => {
                            const images = item['media:group'][0]['media:content'];
                            let score = 0;
                            let bestImage = '';
                            images.forEach(image => {
                                const thisScore = parseInt(image.$.height) + (parseInt(image.$.width) * 10);
                                if (thisScore > score) {
                                    bestImage = image.$.url;
                                    score = thisScore;
                                }
                            });
                            bestImages.push(bestImage);
                        });
                        resolve(bestImages);
                    }
                    catch (e) {
                        resolve([primaryImage]);
                    }
                });
            });
        });
    });
}
