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
    pages: {
        demo: '/newtab.html'
    },
    publish: {
        dist: [
            "newtab.html",
            "js/newtab.js",
            "js/vendor.min.js",
            "js/drawD3map.js",
            "css/newtab.css"
        ]
    },
    controllers: {
        '': function homepage(router) {
            router.readAllViews(views => {
                const output = mustache.render(views.index, {}, views);
                router.res.end(output);
            });
        },
        story: function homepage(router) {
            router.readAllViews(views => {
                getStory(router.path).then((data) => {
                    const regexp = data.Keywords.split(/[: ,]+/).filter(d => d).map(d => `(${d})`).join('|');
                    models_1.Story.findAll({
                        attributes: [
                            'id', 'URL', 'Keywords', 'Primary_image'
                        ],
                        where: {
                            Keywords: {
                                [sequelize_1.Op.regexp]: regexp
                            },
                            Latitude: { [sequelize_1.Op.ne]: null },
                            Longitude: { [sequelize_1.Op.ne]: null },
                            Primary_image: { [sequelize_1.Op.ne]: '' }
                        },
                        order: models_1.Story.sequelize.random(),
                        limit: 12
                    }).then(result => {
                        const relatedStories = result.map(d => d.toJSON());
                        relatedStories.forEach(function (story) {
                            story.keyword = story.Keywords.split(/[: ,]+/)[0];
                        });
                        lodash_1.default.merge(data, {
                            relatedStories: relatedStories
                        });
                        const output = mustache.render(views.story, data, views);
                        router.res.end(output);
                    });
                });
            });
        }
    },
    services: {
        requestjson: function (response, request, db, id) {
            getStory(id)
                .then((result) => {
                lodash_1.default.merge(result, {
                    row_names: result.id,
                    'Primary.image.caption': result.Primary_image_caption,
                    'Primary.image.rights.information': result.Primary_image_rights_information
                });
                response.end(JSON.stringify(result));
            })
                .catch(err => {
                response.writeHead(500);
                response.end(err);
            });
        }
    }
};
exports.config = config;
function getStory(id) {
    return new Promise(function (resolve, reject) {
        const storyOptions = {
            Latitude: { [sequelize_1.Op.ne]: null },
            Longitude: { [sequelize_1.Op.ne]: null },
            Primary_image: { [sequelize_1.Op.ne]: '' }
        };
        if (id && !isNaN(id) && id.length !== 0 && id[0] !== '')
            storyOptions.id = id;
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
                getXmlData(story.MediaRSS_URL, story.Primary_image)
            ];
            Promise.all(promises).then(([town, twitterData, [bestImages, imageDescriptions]]) => {
                const result = {};
                if (twitterData)
                    lodash_1.default.merge(result, twitterData.toJSON());
                lodash_1.default.merge(result, town.toJSON());
                lodash_1.default.merge(result, story.toJSON());
                result.bestImage = bestImages[0];
                result.bestImages = bestImages;
                result.imageDescriptions = imageDescriptions;
                resolve(result);
            });
        }).catch(err => {
            console.log('Error in story requestjson', err);
            reject(err);
        });
    });
}
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
function getXmlData(mediaXmlUrl, primaryImage) {
    return new Promise((resolve) => {
        http_1.default.get(mediaXmlUrl, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                xml2js_1.parseString(data, (err, result) => {
                    if (err) {
                        resolve([[primaryImage]]);
                    }
                    try {
                        const items = result.rss.channel[0].item.filter(d => d);
                        const bestImages = [];
                        const imageDescriptions = [];
                        items.forEach(item => {
                            if (item['media:group'] && item['media:group'][0] && item['media:group'][0]['media:content']) {
                                const description = item.description[0];
                                const images = item['media:group'][0]['media:content'].filter(d => d);
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
                                if (description)
                                    imageDescriptions.push(description);
                            }
                        });
                        resolve([bestImages, imageDescriptions]);
                    }
                    catch (e) {
                        console.log('Error parsing xml:', mediaXmlUrl);
                        console.log(e);
                        resolve([[primaryImage]]);
                    }
                });
            });
        });
    });
}
