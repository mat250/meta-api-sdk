var rp = require('request');

var Mapi = function () { }

Mapi.nodes = [];

Mapi.config = function (mode = "prod", url = "https://api.meta-api.io/api/search") {
  if (mode === "prod") {
    Mapi.url = "https://api.meta-api.io/api/search";
    console.log("MAPI IN PROD");
  } else if (mode === "dev") {
    Mapi.url = url;
  }
}

Mapi.addNode = function (config) {
  //Check de l'id ou set par défaut


  //Vérification de tous les paramètres


}

Mapi.import = function (fullJson) {
  Mapi.json = fullJson;
}

Mapi.launch = function (callback) {
  console.log("Ready to launch request");
    console.log(Mapi);
    if (Mapi.json != null) {
      console.log("Launch request now")
      rp({
        uri: Mapi.url,
        method: 'POST',
        headers: {
          'User-Agent': 'Request-Promise'
        },
        body: Mapi.json,
        json: true // Automatically parses the JSON string in the response
      }, function (error, response, body) {
        if (error) {
          callback(error);
        } else {
          console.log("Request goes fine ;)")
          callback(null, body)
        }
      })
    } else {
      callback("Request as json is not set. Please import or create a new node");
    }
}

module.exports = Mapi;