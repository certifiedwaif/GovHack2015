import { Thalia } from '../../../server/thalia';
import { seq } from './db_bootstrap';
import { Story, TwitterData, Town } from '../models'



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

            Story.findOne({
                order: seq.sequelize.random()
            }).then(result => {
                response.end(JSON.stringify(result));
            })
        }
	}
};






export { config }




