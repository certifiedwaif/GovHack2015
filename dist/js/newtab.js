const xmlhttp = new window.XMLHttpRequest();
const url = '//localstories.info/requestjson';
xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        const myArr = JSON.parse(xmlhttp.responseText);
        myFunction(myArr);
    }
};
xmlhttp.open('GET', url, true);
xmlhttp.send();
function myFunction(arr) {
    console.log(arr);
    d3.select('#background').style('background-image', `url(${arr.bestImage})`);
    d3.select('#title').text(arr.Title);
    d3.select('#url').attr('href', '/story/' + arr.id);
    d3.select('#description').text(arr.Primary_image_caption);
    let twittername = 'abcnews';
    if (arr.username != null) {
        twittername = arr.username;
    }
    d3.select('#twitterlink').attr('href', 'https://twitter.com/' + twittername);
    const rights = arr.Primary_image_rights_information.split('|');
    const copyright = rights[0] ? rights[0].split(':')[1].trim() : 'Unknown';
    const author = rights[2] ? rights[2].split(':')[1].trim() : 'Unknown';
    d3.select('#copyright').text(copyright);
    d3.select('#author').text(author);
    d3.select('#facebook').attr('href', 'https://www.facebook.com/sharer/sharer.php?u=$' + arr.URL);
    d3.select('#twitter').attr('href', 'https://twitter.com/intent/tweet?text=via%20localstories.info%20%40' + twittername + '%20%23GovHack%20%23RealAusArt%20-%20' + arr.URL + ' ' + arr.Title);
    d3.select('#pinterest').attr('href', 'https://pinterest.com/pin/create/link/?url=' + arr.URL);
}
