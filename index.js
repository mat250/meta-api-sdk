var request = require('request');

class Mapi {

  /**
   * Configuration of Meta API package. Mode could be 
   * @param {String} mode : could be "prod" or "dev"
   * @param {String} url : in "dev" mode, an URL can be set
   */
  constructor(mode = "prod", url = "https://api.meta-api.io/api") {
    if (mode === "dev") {
      this.url = url;
    } else {
      this.url = "https://api.meta-api.io/api";
      console.log("MAPI IN PROD");
    }
  }

  /**
   * A valid JSON to send to Meta API Server
   * @param {Object} fullJson 
   */
  import(fullJson) {
    this.json = fullJson;
  }

  /**
   * Callback function which will return the result
   * @param {Function} callback The first parameter is the error variable and the second is the result
   */
  launch(callback) {
    console.log("Ready to launch request");
    console.log(this);
    if (this.json != null) {
      console.log("Launch request now")
      request({
        uri: this.url + "/search",
        method: 'POST',
        body: this.json,
        json: true // Automatically parses the JSON string in the response
      }, function (error, response, body) {
        if (error) {
          callback(error);
        } else {
          console.log("Mapi Request goes fine ;)")
          callback(null, body)
        }
      })
    } else {
      callback("Request as json is not set. Please import or create a new node");
    }
  }

  /**
   * 
   * @param {String} id Valid Spell ID to call 
   * @param {Array} params an array of URL Params
   * @param {Function} callback function which will return the result. The first parameter is the error variable and the second is the result
   */
  spell(id, params, callback) {
    if (id != null && params != null && Array.isArray(params)) {

      let urlParams = "";
      if (params.length > 0) {
        urlParams += "?";
        let allParams = [];
        params.forEach(function (param) {
          if (param.name !== "" && param.value !== "") {
            allParams.push(`${param.name}=${param.value}`);
          }
        }, this);
        urlParams += allParams.join('&');
      }

      let spell_url = `${this.url}/spells/${id}/run${urlParams}`;

      console.log("Spell URL", spell_url);

      request({
        uri: spell_url,
        method: 'GET',
        json: true // Automatically parses the JSON string in the response
      }, function (error, response, body) {
        if (error) {
          callback(error);
        } else {
          console.log("Spell Request goes fine ;)")
          callback(null, body)
        }
      })

    } else {
      callback("Spell : Id not set or params not set or not an array");
    }
  }

}

module.exports = Mapi;