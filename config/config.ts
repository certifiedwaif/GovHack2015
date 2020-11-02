import { Thalia } from '../../../server/thalia';
import { Story, TwitterData, Town } from '../models'
import _ from 'lodash';
import { Op } from 'sequelize';
import { StoryModel, TownModel, TwitterDataModel } from "../models/models"


var config :Thalia.WebsiteConfig = {
	domains: ["localstories.info","www.localstories.info", "truestories.david-ma.net", "govhack2015.david-ma.net"],
	pages: {
		"": "/homepage.html",
		"story": "/story.html",
		"random": "/demo.html"
	},
	services: {
        "requestjson": function(response, request, db, d) {
            // Get a random story
            // Find matching town data
            // Find matching twitter data
            // Serve.

            let result :any = {};

            Story.findOne({
                where: {
                    Latitude: {
                        [Op.ne] : null
                    },
                    Longitude: {
                        [Op.ne] : null
                    },
                    Primary_image: {
                        [Op.ne] : null
                    }
                },
                order: Story.sequelize.random()
            }).then(story => {
                _.merge(result, story.toJSON())

                const byline = story.Primary_image_rights_information.match(/Byline: (.*)/);
                const source = byline ? byline[1] || "ABC" : "ABC";

                const promises = [
                    findNearestTown(story),
                    TwitterData.findOne({
                        where: {
                            sourcename: source
                        }
                    })
                ];

                Promise.all(promises).then(([town, twitterData] :[TownModel, TwitterDataModel]) => {

                    _.merge(result, town.toJSON());
                    if(twitterData) _.merge(result, twitterData.toJSON());

                    response.end(JSON.stringify(result));
                });


            }).catch(err => {
                console.log("Error in story requestjson", err);

                response.end(err);
            });
        }
	}
};


// Recursive promise, to return the nearest town
function findNearestTown(story :StoryModel, size :number = 1) {
    return new Promise(function(resolve){

        Town.findOne({
            where: {
                Place: story.Place
            }
        }).then(town => {
            if(town) {
                // Found a town that matches the place name
                resolve(town);
            } else {
                // No matching town, find the nearest one.

                var target = {
                    lat: [(story.Latitude - size), (story.Latitude + size)],
                    long: [(story.Longitude - size), (story.Longitude + size)]
                }
                Town.findAll({
                    where: {
                        Latitude: {
                            [Op.between] : target.lat
                        },
                        Longitude: {
                            [Op.between] : target.long
                        }
                    }
                }).then(towns => {
                    if(towns.length === 0) {
                        // console.log("No town found, increasing distance to", size + 1);
                        findNearestTown(story, size + 1 ).then(resolve);
                    } else if (towns.length === 1){
                        resolve(towns[0]);
                    } else {
                        // console.log(`Wow, found ${towns.length} towns! Let's find out the closest`);
                        // Oh boy, we have to calculate the distance...
                        let closestTown = null;
                        let closest = 9999999999;
                        towns.map(town => {
                            const calcDist = distance(story.Latitude, story.Longitude, town.Latitude, town.Longitude, "K");
                            // console.log(`${town.Place}, ${town.State}: ${(""+calcDist).slice(0,5)} km`);
                            if ( calcDist < closest ) {
                                closestTown = town;
                                closest = calcDist
                            }
                        });
                        resolve(closestTown);
                    }
                });
            }
        });
    })
}



// https://www.geodatasource.com/developers/javascript
function distance(lat1 :number, lon1 :number, lat2 :number, lon2 :number, unit ?: string) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}



export { config }




