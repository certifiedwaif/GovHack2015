

// Get list of names (from database?)
// Open a connection to twitter
// start querying every name
// push back to database?


// do a twitter query

var twit = {
	init: function(){
		console.log("intitialising twitter stuff!");
		
	}
}

exports.twit = twit;






var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});
 
var params = {screen_name: 'nodejs'};
client.get('statuses/user_timeline', params, function(error, tweets, response){
  if (!error) {
    console.log(tweets);
  }
});

