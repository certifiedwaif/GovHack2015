import { Model, Sequelize } from "sequelize";
import { dbConfig, Story } from '../models'
import csv from 'csv-parser';
import fs from 'fs';

interface seqObject {
    [key: string] : Model | any | Sequelize;
    sequelize :Sequelize;
}

const seq :seqObject = {
    Story: Story,
    sequelize: dbConfig
}

// Fields for Story:
// Title,URL,Date,Primary_image,Primary_image_caption,Primary_image_rights_information,Subjects,Station,State,Place,Keywords,Latitude,Longitude,MediaRSS_URL


// Set to true if you want to create a database on startup
if(false) {

    seq.sequelize.sync({
        // force: true
    }).then( () => {

        // Only reload the stories .csv if we have less than 100 stories.
        Story.count().then( count => {
            if( count < 100 ) {

                fs.createReadStream(`${__dirname}/../data/localphotostories20092014csv.csv`)
                .pipe(csv())
                .on('headers', (headers) => {
                    console.log(`First header: ${headers[0]}`)
                    console.log(`All header: ${headers}`)

                }).on('data', (data) => {
                    const dates = data.Date.split("/");
                    data.Date = `${dates[2]-dates[1]-dates[0]}`;

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

                    Story.findOrCreate({
                        where: { URL: data.URL },
                        defaults: data
                    }).catch((error: Error) => {
                        console.log(error.message);
                        console.log(data);
                    });
                });
            }
        })
    })

}



// Quickly count the max size of each field in the CSV.
function maxFieldSizes( csvPath ) {
    const sizer = {};
    fs.createReadStream( csvPath )
    .pipe(csv())
    .on('headers', (headers) => {
        headers.forEach(header => {
            sizer[header] = 0;
        })
    }).on('data', (data) => {
        Object.keys(data).forEach(col => {
            if(data[col].length > sizer[col]) sizer[col] = data[col].length;
        })
    }).on("end", () => {
        console.log(sizer);
    });
}


exports.seq = seq;