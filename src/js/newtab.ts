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
    Latitude: number;
    Longitude: number;
    Place: string;
    Date: string;
}

const xmlhttp = new window.XMLHttpRequest()
// var url = "//localstories.info/requestjson"; // for the chrome extension
// const url = '/requestjson'
const url = 'https://localstories.info/requestjson';

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

  // arr.l
  drawMap(arr.Latitude, arr.Longitude, arr.Place)
  

  d3.select('#background').style('background-image', `url(${arr.bestImage})`)
  d3.select('#title').text(arr.Title)
  d3.select('#url').attr('href', 'https://localstories.info/story/' + arr.id)
  d3.select("#storyLink").attr('href', 'https://localstories.info/story/' + arr.id)

  d3.select('#description').text(arr.Primary_image_caption)

  let twittername = 'abcnews'

  if (arr.username != null) {
    twittername = arr.username
  }

  d3.select('#twitterlink').attr('href', 'https://twitter.com/' + twittername)

  const rights = arr.Primary_image_rights_information.split('|')
  const copyright = rights[0] ? rights[0].split(':')[1].trim() : 'Unknown'
  const author = rights[2] ? rights[2].split(':')[1].trim() : 'Unknown'
  const date = new Date(arr.Date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric'})

  d3.select('#copyright').text(copyright)
  d3.select('#author').text(author)
  d3.select("#date").text(date)

  d3.select('#facebook').attr('href', 'https://www.facebook.com/sharer/sharer.php?u=$' + arr.URL)
  d3.select('#twitter').attr('href', 'https://twitter.com/intent/tweet?text=via%20localstories.info%20%40' + twittername + '%20%23GovHack%20%23RealAusArt%20-%20' + arr.URL + ' ' + arr.Title)
}
