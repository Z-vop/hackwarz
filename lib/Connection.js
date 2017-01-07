/**
 * The Connection object connects Nodes together into a network.
 */


var Connection = function(obj) {

    this.id = 'xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    this.attackPower = 0;    // This is the power allocated during an attack
    this.description = "Generic Connection";
    this.color = '#154811';
    this.node1 = null;
    this.node2 = null;

    if(typeof obj == 'object') {
        for(var i in obj) {
            if(obj[i]) { this[i] = obj[i]; }
        }
    };
};

module.exports = Connection;
