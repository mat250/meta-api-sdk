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

var mapi_sdk2 = new Mapi("prod");

mapi_sdk2.import([
  {
     "id":0, //On donne un ID au choix à notre objet
     "type":"Geo", //On indique le type d'objet que l'on souhaite récupérer sur Meta API (voir section "Catalogue")
     "params":[ //On va donner quelques paramètres à l'API
        {"name":"address","value":"1 rue de Rivoli 75001 Paris"} //Une adresse
     ]
  },
 {
     "id":1, //Un deuxième élément similaire au 1er, avec une autre adresse
     "type":"Geo",
     "params":[
        {"name":"address","value":"156 av des Champs-Elysées 75008 Paris"}
     ]
  },
  {
     "id":2, //Notre troisième élément qui va connecter les deux premiers
     "type":"Transport", //On recherche un transport
     "api_full_path":"https://api.uber.com/v1/estimates/price", //On précise que l'on souhaite utiliser l'endpoint de Uber
     "params":[
       {"name":"start_latitude","connect_to":0}, //Le point de départ va être connecté à l'élément 0
       {"name":"start_longitude", "connect_to":0},
       {"name":"end_latitude", "connect_to":1}, //Le point d'arrivée à l'élément 1
       {"name":"end_longitude", "connect_to":1}
     ]
  }
]);

mapi_sdk2.launch((err, result) => {
  if (err) console.error(err);
  // console.log(result);
  // console.log(mapi_sdk2.getResults());
  let start_geo = mapi_sdk2.getAllResults()["0"].Geo[0];
  let geo_by_id = mapi_sdk2.getObjectById(start_geo.id);
  let children_geo = mapi_sdk2.getChildren(start_geo.id);
  console.log("plop");
})

console.log(mapi_sdk2);