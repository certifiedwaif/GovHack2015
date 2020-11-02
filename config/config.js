"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const db_bootstrap_1 = require("./db_bootstrap");
const models_1 = require("../models");
var config = {
    domains: ["localstories.info", "www.localstories.info", "truestories.david-ma.net", "govhack2015.david-ma.net"],
    pages: {
        "": "/homepage.html",
        "story": "/story.html",
        "random": "/demo.html"
    },
    services: {
        "requestjson": function (response, request, db, d) {
            models_1.Story.findOne({
                order: db_bootstrap_1.seq.sequelize.random()
            }).then(result => {
                response.end(JSON.stringify(result));
            });
        }
    }
};
exports.config = config;
