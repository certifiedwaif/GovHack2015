var imgs = [
    "/img/1.jpg",
    "/img/2.jpg",
    "/img/3.jpg",
    "/img/4.jpg",
    "/img/5.jpg",
    "/img/6.jpg"
];
var xmlhttp = new XMLHttpRequest();
var url = "/requestjson";
xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var myArr = JSON.parse(xmlhttp.responseText);
        myFunction(myArr);
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();
function myFunction(arr) {
    console.log(arr);
    d3.select("#background").style("background-image", `url(${arr.bestImage})`);
    d3.select("#title").text(arr.Title);
    d3.select("#url").attr("href", "/story/" + arr.id);
    d3.select("#description").text(arr.Primary_image_caption);
    var twittername = "abcnews";
    if (arr.username != null) {
        twittername = arr.username;
    }
    d3.select("#twitterlink").attr("href", "http://twitter.com/" + twittername);
    var rights = arr.Primary_image_rights_information.split("|"), copyright = rights[0] ? rights[0].split(":")[1].trim() : "Unknown", author = rights[2] ? rights[2].split(":")[1].trim() : "Unknown";
    d3.select("#copyright").text(copyright);
    d3.select("#author").text(author);
    d3.select("#facebook").attr("href", "https://www.facebook.com/sharer/sharer.php?u=$" + arr.URL);
    d3.select("#twitter").attr("href", "https://twitter.com/intent/tweet?text=via%20localstories.info%20%40" + twittername + "%20%23GovHack%20%23RealAusArt%20-%20" + arr.URL + " " + arr.Title);
    d3.select("#pinterest").attr("href", "https://pinterest.com/pin/create/link/?url=" + arr.URL);
}
function xmlToJson(xml) {
    var obj = {};
    if (!xml) {
        console.log("warning! No xml?");
    }
    else {
        if (xml.nodeType == 1) {
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        }
        else if (xml.nodeType == 3) {
            obj = xml.nodeValue;
        }
        if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof (obj[nodeName]) == "undefined") {
                    obj[nodeName] = xmlToJson(item);
                }
                else {
                    if (typeof (obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
    }
    return obj;
}
;
