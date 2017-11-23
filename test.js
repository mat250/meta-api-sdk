var Mapi = require('./index.js');

// var mapi_sdk = new Mapi("prod");

// mapi_sdk.spell("5a072a2b13cd7329eca1450d", [
//   {
//     "name": "address_departure",
//     "value": "36 rue Ernest Renan, 92130 Issy les Moulineaux"
//   },
//   {
//     "name": "address_arrival",
//     "value": "1 rue de Rivoli, 75001 Paris"
//   }
// ], (err, result) => {
//   if (err) console.error(err);
//   console.log(result)
// })

var mapi = new Mapi("prod");

mapi.import([
  {
    "id": 1,
    "type": "Geo",
    "api_full_path": "https://maps.googleapis.com/maps/api/geocode/json",
    "params": [
      {
        "name": "address",
        "value": "1 rue de rivoli, 75001 Paris"
      }
    ]
  },
  {
    "id": 2,
    "type": "Place",
    "api_full_path": "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
    "params": [
      {
        "name": "location",
        "connect_to": 1
      },
      {
        "name": "type",
        "value": "restaurant"
      },
      {
        "name": "radius",
        "value": 500
      }
    ]
  },
  {
    "id": 3,
    "type": "Place",
    "api_full_path": "https://maps.googleapis.com/maps/api/place/details/json",
    "params": [
      {
        "name": "placeid",
        "connect_to": 2
      },
      {
        "name": "language",
        "value": "fr"
      }
    ]
  },
  {
    "id": 4,
    "type": "Geo",
    "api_full_path": "https://maps.googleapis.com/maps/api/geocode/json",
    "params": [
      {
        "name": "address",
        "value": "1 rue des Poissonniers, 75018 Paris"
      }
    ]
  },
  {
    "id": 5,
    "type": "Transport",

    "params": [
      {
        "name": "start_latitude",
        "connect_to": 4
      },
      {
        "name": "start_longitude",
        "connect_to": 4
      },
      {
        "name": "end_latitude",
        "connect_to": 2
      },
      {
        "name": "end_longitude",
        "connect_to": 2
      }
    ]
  }
]);

mapi.launch((err, result) => {
  if (err) console.error(err);
  // console.log(result);
  // console.log(mapi_sdk2.getResults());
  let myResults = [];

  //Creating new object

  mapi.getAllResults()["3"].Place.forEach(function (place) {
    if (place.rating >= 3.8) {
      delete place.photos;
      delete place.reviews;
      myResults.push(place);
    }
  }, this);

  //Using Meta API package to find related Uber
  myResults.forEach(place => {
    //Getting parent place (corresponding to ID 2)
    let placeParents = mapi.getParents(place.id);
    if (placeParents.Place[0] != null) {
      //Getting all children generated from this place
      let children = mapi.getChildren(placeParents.Place[0].id);
      if (children != null) {
        //We take all the children which has as type "Uber"
        let ubers = children.Transport;
        console.log()
      }
    }
  });
})

console.log(mapi);