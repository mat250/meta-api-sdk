var rp = require('request');
const uuidv4 = require('uuid/v4');

var Mapi = function () { }

Mapi.nodes = [];

let idCounter = 0;

Mapi.config = function (mode = "prod", url = "https://api.meta-api.io/api/search") {
  if (mode === "prod") {
    Mapi.url = "https://api.meta-api.io/api/search";
    console.log("MAPI IN PROD");
  } else if (mode === "dev") {
    Mapi.url = url;
  }
}

Mapi.addNode = function (node) {

  let newNode = {};

  //Vérification que le noeud ait un type
  if (node.type == null) {
    console.error("Type not set on a new node");
    return false;
  } else {
    //TODO : vérification de la dispo du type sur Meta API

    //On vérifie que le noeud soit bien un string
    if (typeof (node.type) === "string") {
      newNode.type = node.type;
    } else {
      console.error("Type of node is not a string");
      return false;
    }
  }

  //Check de l'id ou set par défaut
  if (node.id == null) {
    newNode.id = idCounter++;
  } else {
    newNode.id = node.id;
  }

  //Vérification de tous les paramètres
  newNode.params = [];
  if (node.params != null) {
    if (Array.isArray(node.params)) {
      node.params.forEach(function (param) {
        if (param.name != null) {
          let newParam = {};
          newParam.name = param.name
          //TODO : Check plus précis sur les types possibles
          if (param.value != null) {
            newParam.value = param.value;
          } else if (param.connect_to != null) {
            newParam.connect_to = param.connect_to;
          } else {
            console.error("this param doesn't have a direct value or a \"connect_to\" value", param);
            return false;
          }
          newNode.params.push(newParam);
        } else {
          console.error("this param doesn't have a name", param);
          return false;
        }
      }, this);
    } else {
      console.error("Node's params is not an array");
      return false;
    }
  }

  Mapi.nodes.push(newNode);

  return newNode;

}

Mapi.getNodes = function () {
  return Mapi.nodes;
}

Mapi.import = function (fullJson) {
  //Checking JSON
  
  Mapi.json = fullJson;
}

Mapi.launch = function (callback) {
  if (Mapi.json != null) {
    console.log("Launch request now on : " + Mapi.url)
    rp({
      uri: Mapi.url,
      method: 'POST',
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