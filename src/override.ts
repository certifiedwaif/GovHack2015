/* eslint-disable camelcase */

type someType = {
    id: string;
    Title: string;
    username: string;
    URL: string;
    Primary_image: string;
    Primary_image_caption: string;
    Primary_image_rights_information: string;
    MediaRSS_URL: string;
    bestImage: string;
    bestImages: Array<string>;
}

const xmlhttp = new window.XMLHttpRequest()
// var url = "//localstories.info/requestjson"; // for the chrome extension
const url = '/requestjson'

xmlhttp.onreadystatechange = function () {
  if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
    const myArr :someType = JSON.parse(xmlhttp.responseText)
    myFunction(myArr)
  }
}
xmlhttp.open('GET', url, true)
xmlhttp.send()

function myFunction (arr :someType) {
  console.log(arr)

  // How should we display multiple images???
  // d3.select("#background").styles({
  //     "background-image": arr.bestImages.map(d => `url(${d})`).join(", "),
  //     "background-position": "right bottom, left top, right top, left bottom",
  //     "background-repeat": "no-repeat",
  //     "background-size": "auto"
  // });

  d3.select('#background').style('background-image', `url(${arr.bestImage})`)
  // d3.select("#background").style("background-image", `url(${arr.Primary_image})`);
  d3.select('#title').text(arr.Title)

  // d3.select("#url").attr("href", arr.URL);
  d3.select('#url').attr('href', '/story/' + arr.id)
  // d3.select("#url").attr("href", "//localstories.info/story/"+arr.id) // chrome extension

  d3.select('#description').text(arr.Primary_image_caption)

  let twittername = 'abcnews'

  if (arr.username != null) {
    twittername = arr.username
  }

  d3.select('#twitterlink').attr('href', 'http://twitter.com/' + twittername)

  const rights = arr.Primary_image_rights_information.split('|')
  const copyright = rights[0] ? rights[0].split(':')[1].trim() : 'Unknown'
  const author = rights[2] ? rights[2].split(':')[1].trim() : 'Unknown'

  d3.select('#copyright').text(copyright)
  d3.select('#author').text(author)

  d3.select('#facebook').attr('href', 'https://www.facebook.com/sharer/sharer.php?u=$' + arr.URL)
  d3.select('#twitter').attr('href', 'https://twitter.com/intent/tweet?text=via%20localstories.info%20%40' + twittername + '%20%23GovHack%20%23RealAusArt%20-%20' + arr.URL + ' ' + arr.Title)
  d3.select('#pinterest').attr('href', 'https://pinterest.com/pin/create/link/?url=' + arr.URL)
}

function xmlToJson (xml) { // eslint-disable-line
  // Create the return object
  let obj = {}

  if (!xml) {
    console.log('warning! No xml?')
  } else {
    if (xml.nodeType === 1) { // element
      // do attributes
      if (xml.attributes.length > 0) {
        obj['@attributes'] = {}
        for (let j = 0; j < xml.attributes.length; j++) {
          const attribute = xml.attributes.item(j)
          obj['@attributes'][attribute.nodeName] = attribute.nodeValue
        }
      }
    } else if (xml.nodeType === 3) { // text
      obj = xml.nodeValue
    }

    // do children
    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes.item(i)
        const nodeName = item.nodeName
        if (typeof (obj[nodeName]) === 'undefined') {
          obj[nodeName] = xmlToJson(item)
        } else {
          if (typeof (obj[nodeName].push) === 'undefined') {
            const old = obj[nodeName]
            obj[nodeName] = []
            obj[nodeName].push(old)
          }
          obj[nodeName].push(xmlToJson(item)) // eslint-disable-line
        }
      }
    }
  }

  return obj
};
