var mapi_sdk = require('./index.js');

mapi_sdk.config("prod");

let aNewNode = {
  // id: 1,
  type: "Transport"
}

mapi_sdk.addNode(aNewNode);

console.log(mapi_sdk.getNodes());