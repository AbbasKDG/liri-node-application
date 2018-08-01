require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

function Launch() {
	switch (cmd) {
		case "my-tweets":
			getTweets();
			break;
		case "spotify-this-song":
			if (song) {
				getSpotify(song);
			} else {
				getSpotify("The Sign Ace of Base");
			}
			break;
		case "movie-this":
			if (movieName) {
				getMovie(movieName)
			} else {
				console.log("If you haven't watched 'Mr. Nobody,' then you should.\nIt's on Netflix! at http://www.imdb.com/title/tt0485947/ ");
			}
			break;
		case "do-what-it-says":
			getFile();
			break;
	}
}

function getTweets() {
	var params = {
		screen_name: "Codemeister6",
		count: 20,
	}
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (error) {
			console.log("Error Log: " + error);
		} else {
			console.log("My recent Tweeting: ");
			for (var i = 0; i < tweets.length; i++) {
				console.log(tweets[i].text);
				console.log("Created: " + tweets[i].created_at + "\n");
			}
		}
	});
};

function getSpotify(song) {
	spotify.search({
		type: 'track',
		query: song
	}, function(error, data) {
		if (error) {
			console.log("Error Log: " + error);
		} else {
			var track = data.tracks.items[0];
			for (var i = 0; i < track.artists.length; i++) {
				console.log("Artist: " + track.artists[i].name);
			}
		}
		console.log("Song: " + track.name);
		console.log("Album: " + track.album.name);
		console.log("Preview link: " + track.preview_url);
	});
};

function getMovie(movieName) {
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
	console.log(queryUrl);
	request(queryUrl, function(error, response, body) {
	
		if (!error && response.statusCode === 200) {
			var parse = JSON.parse(body);
			var title = parse.Title;
			var year = parse.Year;
			var actors = parse.Actors;
			var plot = parse.Plot;
			var lang = parse.Language;
			var country = parse.Country;
			var imdbRating = parse.imdbRating;
			var rating = parse.Ratings[1].Value;
			console.log("Title: " + title + "\n" + "Year: " + year + "\n" + "Actors: " + actors + "\n" + "Plot: " + plot + "\n" + "Language: " + lang + "\n" + "Country: " + country + "\n" + "IMDB Rating: " + imdbRating + "\n" + "Rotten Tomatoes Rating: " + JSON.stringify(rating));
		}
	});
};

function getFile() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			return console.log(error);
		}
		var dataArr = data.split(",");
		var data = dataArr[1];
		getSpotify(data);
	});
}
process.argv = process.argv.slice(2);
var cmd = process.argv[0];
var song = JSON.stringify(process.argv[1]);
var movieName = process.argv[1];
Launch();