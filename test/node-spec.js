/** Tests for the Node object */

var chai = require('chai');
var expect = require('chai').expect;
var should = require('chai').should();

var User = require('../lib/User');
var Node = require('../lib/Node');


var node1 = {
    id: 1,
    health: 200,
    power: 20,
    baseColor: '#4286f4'
}

describe('Test Nodes', function () {
    describe('Test object construction', function () {
        it('should return distinct objects', function () {
            var n1 = new Node(node1);
            var n2 = new Node();
            expect(n1).to.not.equal(n2);
            expect(n1).to.be.an.instanceOf(Node);
        });
    });

});



