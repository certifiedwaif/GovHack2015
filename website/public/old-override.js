
var imgs = [
"/img/1.jpg",
"/img/2.jpg",
"/img/3.jpg",
"/img/4.jpg",
"/img/5.jpg",
"/img/6.jpg"
]



var xmlhttp = new XMLHttpRequest();
var url = "http://localstories.info/requestjson";

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var myArr = JSON.parse(xmlhttp.responseText);
        myFunction(myArr);
    }
}
xmlhttp.open("GET", url, true);
xmlhttp.send();

function myFunction(arr) {
	console.log(arr);




d3.select("#background").style("background-image", "url("+arr["Primary.image"]+")");
d3.select("#title").text(arr.Title);
d3.select("#url").attr("href", arr.URL);
d3.select("#description").text(arr["Primary.image.caption"]);









var xmlhttp = new XMLHttpRequest();
var url = arr["MediaRSS.URL"];

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var myArr = xmlhttp.responseText;
        digest(myArr);
    }
}
xmlhttp.open("GET", url, true);
xmlhttp.send();


function digest(xml){
	console.log(xml);
}
}















