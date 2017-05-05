/**
 * The Node object can be hacked and can initiate attacks.
 */


var Node = function(obj) {

    this.id = 'xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    this.defense = 100;
    this.attack = 10;
    this.description = "Generic Node";
    this.x = 100;
    this.y = 100;
    this.size = 30;
    this.baseColor = '#e8e8e8';
    this.owner = 0;
    this.health = 100;

    var _owner = 0;

    if(typeof obj == 'object') {
        for(var i in obj) {
            if(obj[i]) { this[i] = obj[i]; }
        }
    };

    /** Does something */
    Node.prototype.doSomething = function () {
    };

    Object.defineProperty(this, "owner", {
        get: function () {
            return _owner;
        },
        set: function (owner) {
            _owner = owner;
            if (owner == 0) {
                setBaseColor('#e8e8e8') // grey
            }
        }
    });

};



module.exports = Node;
