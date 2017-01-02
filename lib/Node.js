/**
 * The Node object can be hacked and can initiate attacks.
 */


var Node = function(obj) {

    this._id = 'xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    this.health = 100;
    this.power = 10;
    this.description = "Generic Node";
    this.x = 100;
    this.y = 100;
    this.baseColor = 'grey';

    if(typeof obj == 'object') {
        for(var i in obj) {
            if(obj[i]) { this[i] = obj[i]; }
        }
    };

    /** Does something */
    Node.prototype.doSomething = function () {
    };

};

module.exports = Node;
