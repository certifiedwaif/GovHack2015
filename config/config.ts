import { Thalia } from '../../../server/thalia'
import { Story, TwitterData, Town } from '../models'
import _ from 'lodash'
import { Op, WhereOptions } from 'sequelize'
import { StoryAttributes, StoryModel, TownModel, TwitterDataModel } from '../models/models'
import http, { IncomingMessage } from 'http'
import { parseString as parseXml } from 'xml2js'
import mustache = require('mustache');

const config: Thalia.WebsiteConfig = {
  domains: ['truestories.david-ma.net', 'govhack2015.david-ma.net'],
  pages: {
    demo: '/newtab.html'
  },
  publish: {
    dist: [
      "newtab.html",
      "js/newtab.js",
      "js/vendor.min.js",
      "js/drawD3map.js",
      "css/homepage.css",
      "css/newtab.css"
    ]
  },
  controllers: {
    '': function homepage (router) {
      router.readAllViews(views => {
        const output = mustache.render(views.index, {}, views)
        router.res.end(output)
      })
    },
    story: function homepage (router) {
      router.readAllViews(views => {
        getStory(router.path).then((data :any) => {
          // console.log('keywords', data.Keywords)
          // const regexp = data.Keywords.split(/[: ,]+/).filter(d => d).map(d => `(${d})`).join('|')
          // console.log('regexp', regexp)

          Story.findAll({
            attributes: [
              'id', 'URL', 'Keywords', 'Primary_image'
            ],
            where: {
              // Can't use regexp in sqlite3
              // Keywords: {
              //   [Op.regexp]: regexp
              // },
              Latitude: { [Op.ne]: null },
              Longitude: { [Op.ne]: null },
              Primary_image: { [Op.ne]: '' }
            },
            order: Story.sequelize.random(),
            limit: 12
          }).then(result => {
            const relatedStories = result.map(d => d.toJSON())
            relatedStories.forEach(function (story :any) {
              story.keyword = story.Keywords.split(/[: ,]+/)[0]
            })

            _.merge(data, {
              relatedStories: relatedStories
            })

            const output = mustache.render(views.story, data, views)
            router.res.end(output)
          })
        })
      })
    }
  },
  services: {
    requestjson: function (response, request, db, id) {
      // Get a random story
      // Find matching town data
      // Find matching twitter data
      // Serve.
      getStory(id)
        .then((result :any) => {
          // Legacy stuff, for old extension users
          _.merge(result, {
            row_names: result.id,
            'Primary.image.caption': result.Primary_image_caption,
            'Primary.image.rights.information': result.Primary_image_rights_information
          })

          response.end(JSON.stringify(result))
        })
        .catch(err => {
          response.writeHead(500)
          response.end(err)
        })
    }
  }
}

function getStory (id?: any) {
  return new Promise(function (resolve, reject) {
    const storyOptions: WhereOptions<StoryAttributes> = {
      Primary_image_rights_information: { [Op.ne]: null },
      Latitude: { [Op.ne]: null },
      Longitude: { [Op.ne]: null },
      Primary_image: { [Op.ne]: '' }
    }

    if (id && !isNaN(id) && id.length !== 0 && id[0] !== '') storyOptions.id = id

    Story.findOne({
      where: storyOptions,
      order: Story.sequelize.random()
    }).then(story => {
if(story) {
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
        getXmlData(story.MediaRSS_URL, story.Primary_image)
      ]

      Promise.all(promises).then(([town, twitterData, [bestImages, imageDescriptions]]: [TownModel, TwitterDataModel, [Array<string>, Array<string>]]) => {
        const result: any = {}
        if (twitterData) _.merge(result, twitterData.toJSON()) // No twitter? That's fine.
        _.merge(result, town.toJSON())
        _.merge(result, story.toJSON())
        result.bestImage = bestImages[0]
        result.bestImages = bestImages
        result.imageDescriptions = imageDescriptions
        resolve(result)
      })
} else {
  // TODO: , handle failure state here.
  resolve({})
}
    }).catch(err => {
      console.log('Error in story requestjson', err)
      reject(err)
    })
  })
}

// Recursive promise, to return the nearest town
function findNearestTown (story: StoryModel, size: number = 1) {
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

        const target : {
          lat : [number, number]
          long : [number, number]
        } = {
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
function distance (lat1: number, lon1: number, lat2: number, lon2: number, unit?: string) {
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
function getXmlData (mediaXmlUrl: string, primaryImage) {
  return new Promise((resolve) => {
    http.get(mediaXmlUrl, (res: IncomingMessage) => {
      let data = ''
      // A chunk of data has been recieved.
      res.on('data', (chunk) => {
        data += chunk
      })

      // The whole response has been received. Print out the result.
      res.on('end', () => {
        parseXml(data, (err, result) => {
          if (err || !result) {
            console.log('Error parsing xml:', mediaXmlUrl)
            console.log(err || "Result missing")
            resolve([[primaryImage]])
            return;
          }
          try {
            const items: Array<{
              'description': string;
              'media:group': Array<{
                'media:content': Array<{
                  '$': {
                    url: string;
                    type: string;
                    width: string;
                    height: string;
                  }
                }>
              }>
            }> = result.rss.channel[0].item.filter(d => d)

            const bestImages = []
            const imageDescriptions = []
            items.forEach(item => {
              if (item['media:group'] && item['media:group'][0] && item['media:group'][0]['media:content']) {
                const description = item.description[0]
                const images = item['media:group'][0]['media:content'].filter(d => d)
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
                if (description) imageDescriptions.push(description)
              }
            })
            resolve([bestImages, imageDescriptions])
          } catch (e) {
            console.log('Error parsing xml:', mediaXmlUrl)
            console.log(e)
            resolve([[primaryImage]])
          }
        })
      })
    })
  })
}

export { config }
