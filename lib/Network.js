/**
 * The Network object consists of Nodes and Connections.
 */

var User = require('../lib/User');
var Node = require('../lib/Node');
var Connection = require('../lib/Connection');

var Network = function(obj) {

    this._id = 'xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    this.description = "Generic Network";
    this.nodes = [];            // Array of Nodes
    this.connections = [];      // Array of Connections


    if(typeof obj == 'object') {
        for(var i in obj) {
            if(obj[i]) { this[i] = obj[i]; }
        }
    };

    /** Connects two nodes together with a Connection */
    Network.prototype.connectNodes = function (node1, node2) {
        this.connections.push(new Connection({ node1: node1, node2: node2}));
    };

    Object.defineProperty(this, "json", {
        get: function () {
            return JSON.stringify(this);
        }
    });
};

module.exports = Network;

