var Mapi = require('./index.js');

var mapi_sdk = new Mapi("prod");

mapi_sdk.spell("5a072a2b13cd7329eca1450d", [
  {
    "name": "address_departure",
    "value": "36 rue Ernest Renan, 92130 Issy les Moulineaux"
  },
  {
    "name": "address_arrival",
    "value": "1 rue de Rivoli, 75001 Paris"
  }
], (err, result) => {
  if (err) console.error(err);
  console.log(result)
})

console.log(mapi_sdk);