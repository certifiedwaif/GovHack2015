"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const models_1 = require("../models");
const lodash_1 = __importDefault(require("lodash"));
const sequelize_1 = require("sequelize");
var config = {
    domains: ["localstories.info", "www.localstories.info", "truestories.david-ma.net", "govhack2015.david-ma.net"],
    pages: {
        "": "/homepage.html",
        "story": "/story.html",
        "random": "/demo.html"
    },
    services: {
        "requestjson": function (response, request, db, d) {
            let result = {};
            models_1.Story.findOne({
                where: {
                    Latitude: {
                        [sequelize_1.Op.ne]: null
                    },
                    Longitude: {
                        [sequelize_1.Op.ne]: null
                    },
                    Primary_image: {
                        [sequelize_1.Op.ne]: null
                    }
                },
                order: models_1.Story.sequelize.random()
            }).then(story => {
                lodash_1.default.merge(result, story.toJSON());
                console.log(`Found story: ${story.id} ${story.Place}`);
                models_1.Town.findOne({
                    where: {
                        Place: story.Place
                    }
                }).then(town => {
                    if (town) {
                        console.log("Found matching town,", town.Place);
                        lodash_1.default.merge(result, town.toJSON());
                        response.end(JSON.stringify(result));
                    }
                    else {
                        findNearestTown(story).then((town) => {
                            console.log("Found a result!");
                            console.log(town.Place + " " + town.State);
                            lodash_1.default.merge(result, town.toJSON());
                            response.end(JSON.stringify(result));
                        });
                    }
                }).catch(err => {
                    console.log("Error in town requestjson", err);
                    response.end(err);
                });
            }).catch(err => {
                console.log("Error in story requestjson", err);
                response.end(err);
            });
        }
    }
};
exports.config = config;
function findNearestTown(story, size = 1) {
    return new Promise(function (resolve) {
        var target = {
            lat: [(story.Latitude - size), (story.Latitude + size)],
            long: [(story.Longitude - size), (story.Longitude + size)]
        };
        console.log(target);
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
                console.log("No town found, increasing distance to", size + 1);
                findNearestTown(story, size + 1).then(resolve);
            }
            else if (towns.length === 1) {
                resolve(towns[0]);
            }
            else {
                console.log(`Wow, found ${towns.length} towns! Let's find out the closest`);
                let closestTown = null;
                let closest = 9999999999;
                towns.map(town => {
                    const calcDist = distance(story.Latitude, story.Longitude, town.Latitude, town.Longitude, "K");
                    console.log(`${town.Place}, ${town.State}: ${("" + calcDist).slice(0, 5)} km`);
                    if (calcDist < closest) {
                        closestTown = town;
                        closest = calcDist;
                    }
                });
                resolve(closestTown);
            }
        });
    });
}
function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") {
            dist = dist * 1.609344;
        }
        if (unit == "N") {
            dist = dist * 0.8684;
        }
        return dist;
    }
}
