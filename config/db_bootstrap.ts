import { Model, Sequelize } from 'sequelize'
import { dbConfig, Story, TwitterData, Town } from '../models'
import csv from 'csv-parser'
import fs from 'fs'
import path from 'path'

interface seqObject {
    [key: string] : Model | any | Sequelize;
    sequelize :Sequelize;
}

const seq :seqObject = {
  Story: Story,
  TwitterData: TwitterData,
  Town: Town,
  sequelize: dbConfig
}

/** Data sources:
 * ABC Local online photo stories
 * https://data.gov.au/data/dataset/abc-local-online-photo-stories-2009-2014/resource/d73f2a2a-c271-4edd-ac45-25fd7ad2241f
 *
 * Twitter search for their usernames
 *
 * Small Town Data processed by Mark Greenaway during 2015 hackathon.
 * Probably from these sources:
 * ABS Small towns:
 * https://www.abs.gov.au/ausstats/abs@.nsf/Lookup/2071.0main+features1132016
 * URBAN CENTRE AND LOCALITY (UCL)
 * https://www.abs.gov.au/ausstats/abs@.nsf/Latestproducts/05773C1D8C9F2022CA257A98001399F7?opendocument
 */

// Fields for Story:
// Title,URL,Date,Primary_image,Primary_image_caption,Primary_image_rights_information,Subjects,Station,State,Place,Keywords,Latitude,Longitude,MediaRSS_URL

// Set to true if you want to create a database on startup
if (true) { // eslint-disable-line no-constant-condition
  seq.sequelize.sync({
    // force: true
  }).then(() => {
    // fs.createReadStream(`${__dirname}/../data/small_town_data.csv`)
    fs.createReadStream(path.resolve(__dirname, '..', 'data', 'small_town_data.csv'))
      .pipe(csv())
      .on('headers', headers => { // eslint-disable-line
        // console.log(`Small Town Data csv headers: ${headers.join(', ')}`)
      }).on('data', data => {
        Town.findOrCreate({
          where: { Place: data.Place },
          defaults: data
        }).catch((error: Error) => {
          console.log(error.message)
          console.log(data)
        })
      })

    // Only reload the stories .csv if we have less than 100 stories.
    Story.count().then(count => {
      if (count < 100) {
        // fs.createReadStream(`${__dirname}/../data/localphotostories20092014csv.csv`)
        fs.createReadStream(path.resolve(__dirname, '..', 'data', 'localphotostories20092014csv.csv'))
          .pipe(csv())
          .on('headers', (headers) => {  // eslint-disable-line
            // console.log(`Local Photo Stories csv headers: ${headers.join(', ')}`)
          }).on('data', (data) => {
            // Stupid oneliner to reformat dates for moment.js yyyy-mm-dd
            // https://momentjs.com/docs/#/parsing/
            // https://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date
            const dates = data.Date.split('/')
            data.Date = `${dates[2]}-${('0' + dates[1]).slice(-2)}-${('0' + dates[0]).slice(-2)}`

            data.Primary_image = data['Primary image']
            data.Primary_image_caption = data['Primary image caption']
            data.Primary_image_rights_information = data['Primary image rights information']
            data.MediaRSS_URL = data['MediaRSS URL']
            data.Latitude = data.Latitude || null
            data.Longitude = data.Longitude || null

            delete data['Primary image']
            delete data['Primary image caption']
            delete data['Primary image rights information']
            delete data['MediaRSS URL']

            Story.findOrCreate({
              where: { URL: data.URL },
              defaults: data
            }).catch((error: Error) => {
              console.log(error.message)
              console.log(data)
            })
          })
      }
    })

    /**
         * Twitter Name Search is data scraped from a simple twitter search.
         * Very little effort has been put into curating these usernames
         * and making sure they belong to the correct journalists.
         */
    // fs.createReadStream(`${__dirname}/../data/twitter_name_search.csv`)
    fs.createReadStream(path.resolve(__dirname, '..', 'data', 'twitter_name_search.csv'))
      .pipe(csv())
      .on('headers', headers => {  // eslint-disable-line
        // console.log(`Twitter Data csv headers: ${headers.join(', ')}`)
      }).on('data', data => {
        TwitterData.findOrCreate({
          where: { username: data.username },
          defaults: data
        }).then(([twitterData, created]) => { // eslint-disable-line

          /* Run this if you want to check Story & TwitterData are working
                    Story.findAll({
                        where: {
                            Primary_image_rights_information: {
                                [Op.like]: `%${twitterData.sourcename}%`
                            }
                        }
                    }).then(results => {
                        console.log(twitterData.sourcename +": "+results.map(d => d.id).join(", "));
                    });
*/

        }).catch((error: Error) => {
          console.log(error.message)
          console.log(data)
        })
      })
  })
}

// inspectCSV(`${__dirname}/../data/small_town_data.csv`);

// Font colors: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
// Quickly count the max size of each field in the CSV.
function inspectCSV (csvPath :string) { // eslint-disable-line
  const sizer = {}
  let count = 0
  let example = []
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('headers', (headers :Array<string>) => {
      headers.forEach(header => {
        sizer[header] = 0
      })
    }).on('data', (data) => {
      Object.keys(data).forEach(col => {
        if (data[col].length > sizer[col]) sizer[col] = data[col].length
      })
      count++

      if (example.length === 0) example = data
    }).on('end', () => {
      console.log('Row count:', count)
      console.log('Column Names, Max Length, Example Entry')
      Object.keys(sizer).forEach(key => {
        console.log(`${key}: \x1b[33m${sizer[key]}\x1b[0m, \x1b[32m'${example[key]}'\x1b[0m`)
      })
    })
}

// Turns out we're just exporting the names of the models as strings..? And not the Static model objects?
// console.log("Exporting seq", seq);

export { seq }
