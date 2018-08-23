const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const path = require("path");
const app = express();

const clientId = "7e276a1dab0340eebdcf6c128e456618"; // TO CHANGE
const clientSecret = "6353f9b843c7441c89f3ba98611d17fa"; // TO CHANGE

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));
hbs.registerPartials(__dirname + "/views/partials");

app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/artists", (req, res, next) => {
  const query = req.query.artist;
  spotifyApi
    .searchArtists(query)
    .then(data => {
      data = data.body.artists.items;
      console.log(data[0].images[0].url);
      res.render("artists", { data });
      // res.send(data);
    })
    .catch(err => {
      console.error(err);
    });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
