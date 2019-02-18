'use strict';
/**
 * Load Twilio configuration from .env config file - the following environment
 * variables should be set:
 * process.env.TWILIO_ACCOUNT_SID
 * process.env.TWILIO_API_KEY
 * process.env.TWILIO_API_SECRET
 * 
 * The code below loads .env from project root directory
 * as a JS object accessible as 'process.env'
 */
require('dotenv').config({ path: '../.env' });

const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const randomName = require('./randomname');
var AccessToken = require('twilio').jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant; 

/**
 * Set up the path for the public to be accessible 
 * as static files servable to the user
 * NOTE: in the code "app.use('/public',..", '/public' is a 
 * virtual link which doesnt physically exist in disk 
 * and it represets, '../public' folder
 * NB:this allows us to make requests to the public 
 * folder without errors such as 404 not found errors
 */
var publicPath = path.join(__dirname, '../public');
app.use('/public', express.static(publicPath));

/**
 * Default to the home page.
 */
app.get('/', function(request, response) {
  response.redirect('/public/view/index.html');
});

//Get acces token from the server
app.get('/token', function(request, response) {
  var identity = randomName();

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created.
  var token = new AccessToken(
    'AC6ef4af32c838ec604299d83ccdaa20ed',
    'SK158c842967d9fa2dc66ac91f4cad6d2f',
    'E0cmqQ2pJL1uNf7EsoMGPo8HWxAlCRKQ'
  );

  // Assign the generated identity to the token.
  token.identity = identity;

  // Grant the access token Twilio Video capabilities.
  var grant = new VideoGrant();
  token.addGrant(grant);

  // Serialize the token to a JWT string and include it in a JSON response.
  response.send({
    identity: identity,
    token: token.toJwt()
  });
});

//configure server props
var server = http.createServer(app);
var port = process.env.PORT || 3000;

//run app(server) on port specified
server.listen(port, function() {
  console.log('Express server running on port: ' + port);
});