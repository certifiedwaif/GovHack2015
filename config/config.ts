import { Thalia } from '../../../server/thalia'
import { Story, TwitterData, Town } from '../models'
import _ from 'lodash'
import { Op, WhereOptions } from 'sequelize'
import { StoryAttributes, StoryModel, TownModel, TwitterDataModel } from '../models/models'
import http, { IncomingMessage } from 'http'
import { parseString as parseXml } from 'xml2js'
import mustache = require('mustache');

const config :Thalia.WebsiteConfig = {
  domains: ['localstories.info', 'www.localstories.info', 'truestories.david-ma.net', 'govhack2015.david-ma.net'],
  controllers: {
    '': function homepage (router) {
      router.readAllViews(views => {
        const output = mustache.render(views.index, {}, views)
        router.res.end(output)
      })
    }
  },
  services: {
    requestjson: function (response, request, db, d) {
      // Get a random story
      // Find matching town data
      // Find matching twitter data
      // Serve.

      const storyOptions :WhereOptions<StoryAttributes> = {
        Latitude: { [Op.ne]: null },
        Longitude: { [Op.ne]: null },
        Primary_image: { [Op.ne]: '' }
      }
      if (d && !isNaN(d)) storyOptions.id = d

      Story.findOne({
        where: storyOptions,
        order: Story.sequelize.random()
      }).then(story => {
        const byline = story.Primary_image_rights_information.match(/Byline: (.*)/)
        const source = byline ? byline[1] || 'ABC' : 'ABC' // Default to ABC if we can't find a byline
        // Todo: Get better searching on the Twitter handles, find more journalists. Default to local ABC

        const promises = [
          findNearestTown(story),
          TwitterData.findOne({
            where: {
              sourcename: source
            }
          }),
          findBestImages(story.MediaRSS_URL, story.Primary_image)
        ]

        Promise.all(promises).then(([town, twitterData, bestImages] :[TownModel, TwitterDataModel, Array<string>]) => {
          const result :any = {}
          if (twitterData) _.merge(result, twitterData.toJSON()) // No twitter? That's fine.
          _.merge(result, town.toJSON())
          _.merge(result, story.toJSON())
          result.bestImage = bestImages[0]
          result.bestImages = bestImages
          response.end(JSON.stringify(result))
        })
      }).catch(err => {
        console.log('Error in story requestjson', err)

        response.end(err)
      })
    }
  }
}

// Recursive promise, to return the nearest town
function findNearestTown (story :StoryModel, size :number = 1) {
  return new Promise(function (resolve) {
    Town.findOne({
      where: {
        Place: story.Place
      }
    }).then(town => {
      if (town) {
        // Found a town that matches the place name
        resolve(town)
      } else {
        // No matching town, find the nearest one.

        const target = {
          lat: [(story.Latitude - size), (story.Latitude + size)],
          long: [(story.Longitude - size), (story.Longitude + size)]
        }
        Town.findAll({
          where: {
            Latitude: {
              [Op.between]: target.lat
            },
            Longitude: {
              [Op.between]: target.long
            }
          }
        }).then(towns => {
          if (towns.length === 0) {
            // console.log("No town found, increasing distance to", size + 1);
            findNearestTown(story, size + 1).then(resolve)
          } else if (towns.length === 1) {
            resolve(towns[0])
          } else {
            // console.log(`Wow, found ${towns.length} towns! Let's find out the closest`);
            // Oh boy, we have to calculate the distance...
            let closestTown = null
            let closest = 9999999999
            towns.forEach(town => {
              const calcDist = distance(story.Latitude, story.Longitude, town.Latitude, town.Longitude, 'K')
              // console.log(`${town.Place}, ${town.State}: ${(""+calcDist).slice(0,5)} km`);
              if (calcDist < closest) {
                closestTown = town
                closest = calcDist
              }
            })
            resolve(closestTown)
          }
        })
      }
    })
  })
}

// https://www.geodatasource.com/developers/javascript
function distance (lat1 :number, lon1 :number, lat2 :number, lon2 :number, unit ?: string) {
  if ((lat1 === lat2) && (lon1 === lon2)) {
    return 0
  } else {
    const radlat1 = Math.PI * lat1 / 180
    const radlat2 = Math.PI * lat2 / 180
    const theta = lon1 - lon2
    const radtheta = Math.PI * theta / 180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    if (dist > 1) {
      dist = 1
    }
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit === 'K') { dist = dist * 1.609344 }
    if (unit === 'N') { dist = dist * 0.8684 }
    return dist
  }
}

// Weird xml stuff.
function findBestImages (mediaXmlUrl :string, primaryImage) {
  return new Promise((resolve) => {
    http.get(mediaXmlUrl, (res :IncomingMessage) => {
      let data = ''
      // A chunk of data has been recieved.
      res.on('data', (chunk) => {
        data += chunk
      })

      // The whole response has been received. Print out the result.
      res.on('end', () => {
        parseXml(data, (err, result) => {
          if (err) resolve([primaryImage])
          try {
            const items :Array<{
                            'media:group': Array<{
                                'media:content': Array<{'$':{
                                    url :string;
                                    type: string;
                                    width: string;
                                    height: string;
                                }}>
                            }>
                        }> = result.rss.channel[0].item // [0]['media:group']; //[0]['media:content'];

            const bestImages = []
            items.forEach(item => {
              const images = item['media:group'][0]['media:content']
              let score = 0
              let bestImage = ''

              images.forEach(image => {
                // var thisScore = parseInt(image.$.height) + (parseInt(image.$.width) * 2.5);
                const thisScore = parseInt(image.$.height) + (parseInt(image.$.width) * 10)
                if (thisScore > score) {
                  bestImage = image.$.url
                  score = thisScore
                }
              })
              bestImages.push(bestImage)
            })
            resolve(bestImages)
          } catch (e) {
            resolve([primaryImage])
          }
        })
      })
    })
  })
}

export { config }
