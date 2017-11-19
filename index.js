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
    if (this.json != null) {
      console.log("Launch request now")
      let mapi_this = this;
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
          mapi_this._parseResponse(body.results);
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

  /**
   * Return objects of a specific type inside a Re
   * @param {String} result_id 
   * @param {String} type 
   */
  getObjectsByType(result_id, type) {
    if (this.results[result_id] != null) {
      if (this.results[result_id][type] != null) {
        return this.results[result_id][type];
      } else {
        console.error("Type not found in this result");
      }
    } else {
      console.error("Result not found");
    }
    return [];
  }

  /**
   * Function to find easyly object by id
   * @param {String} object_id
   */
  getObjectById(object_id) {
    let link_ref = this.refTable[object_id];
    if (link_ref != null) {
      return this.results[link_ref.result_position][link_ref.object_type][link_ref.object_position];
    }
  }

  /**
   * Fonction to filter and find objects
   */
  filterObject() {

  }

  getAllResults() {
    return this.results;
  }

  getParents(object_id) {
    return this._getObjectsLinked(object_id, "parents");
  }

  getChildren(object_id) {
    return this._getObjectsLinked(object_id, "children");
  }

  /**
   * Private : function to get linked object. Used by getParents and getChildren
   * @param {String} object_id 
   * @param {String} type 
   */
  _getObjectsLinked(object_id, type) {
    let foundObjects = {};
    if (this.refTable[object_id] != null) {
      this.refTable[object_id][type].forEach(link_id => {
        let link_ref = this.refTable[link_id];
        if (link_ref != null) {
          if (this.results[link_ref.result_position] != null && this.results[link_ref.result_position][link_ref.object_type] != null) {
            let link_object = this.results[link_ref.result_position][link_ref.object_type][link_ref.object_position];
            if (link_object != null) {
              if (foundObjects[link_object._type] == null) {
                foundObjects[link_object._type] = [];
              }
              foundObjects[link_object._type].push(link_object);
            }
          }
        }
      }, this);
      return foundObjects;
    } else {
      console.error("Ref of this object can't be found");
    }
  }

  /**
   * Parsing reponses to transport them into nice objects to use
   * @param {Object} results 
   */
  _parseResponse(results) {
    if (results != null) {
      let refTable = {};
      let newResults = {};
      results.forEach(result => {
        let aRes = result;
        Object.keys(aRes).forEach(type => {
          if (type != "id") {
            let objects = aRes[type];
            objects.forEach((object, object_index) => {
              object._type = type;
              if (refTable[object.id] == null) {
                refTable[object.id] = {
                  result_position: result.id,
                  object_position: object_index,
                  object_type: type,
                  parents: [],
                  children: []
                }
              }
            });

          }
        });
        newResults[result.id] = aRes;
      });
      this.results = newResults;
      this.refTable = refTable;

      this._resolveLinksBetweenObjects();
    } else {
      console.error("result is null : sound like an network or server error...");
    }

  }

  _resolveLinksBetweenObjects() {
    Object.keys(this.results).forEach(result_id => {
      Object.keys(this.results[result_id]).forEach(type => {
        if (type != 'id') {
          this.results[result_id][type].forEach(object => {
            if (object.parents != null) {
              object.parents.forEach(parent => {
                //Looking for id in refTable
                let parent_id = null;
                let parent_type = null;
                if (typeof (parent) === "string") {
                  parent_id = parent;
                  parent_type = "child";
                } else {
                  parent_id = parent.id;
                  parent_type = "parent";
                }
                if (parent_id != null && parent_type != null && this.refTable[parent_id] != null) {
                  switch (parent_type) {
                    case "parent":
                      if (!this.refTable[parent_id].children.includes(object.id))
                        this.refTable[parent_id].children.push(object.id);
                      break;

                    case "child":
                      if (!this.refTable[parent_id].parents.includes(object.id))
                        this.refTable[parent_id].parents.push(object.id);
                      break;

                    default:
                      break;
                  }
                }
                if (this.refTable[object.id] != null) {
                  switch (parent_type) {
                    case "parent":
                      if (!this.refTable[object.id].parents.includes(parent_id))
                        this.refTable[object.id].parents.push(parent_id);
                      break;

                    case "child":
                      if (!this.refTable[object.id].children.includes(parent_id))
                        this.refTable[object.id].children.push(parent_id);
                      break;

                    default:
                      break;
                  }
                }
              }, this);
            }
          });
        }
      });
    });
  }


}

module.exports = Mapi;