
var imgs = [
"/img/1.jpg",
"/img/2.jpg",
"/img/3.jpg",
"/img/4.jpg",
"/img/5.jpg",
"/img/6.jpg"
]



d3.select("body").attr("background", imgs[Math.floor(Math.random()*6)]);

// 	console.log("hellooo");
// 
// d3.select("#message").text("change text!");
// 
// d3.select("#message").attr("asdf", function(d){
// 	console.log("hi");
// })
// console.log("woo");


d3.json("dummy.json", function(d){
	console.log(d);
})
