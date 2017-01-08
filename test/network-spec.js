/**
 * Created by cameron on 3/27/16.
 */

var chai = require('chai');
var expect = require('chai').expect;


var User = require('../lib/User');
var Node = require('../lib/Node');
var Connection = require('../lib/Connection');
var Network = require('../lib/Network');

var users = [];
var network = null;

var user1 = {
    name: "oliver",
    level: 1,
    color: "blue"
};

var user2 = {
    name: "cameron",
    password: "asdf",
    level: 1,
    coins: 5.0,
    color: "red"
};

var node1 = {
    description: "node1",
    x: 100, y: 100
};

var node2 = {
    description: "node2",
    x: 300, y: 100
}


describe("Test Network Operations", function () {
    var u1 = new User(user1);
    var u2 = new User(user2);
    users = [u1, u2];

    node1 = new Node(node1);
    node2 = new Node(node2);

    describe("Test object construction", function () {

        it("should create unique object", function () {
            network = new Network();
            expect(network).to.be.ok;
        });

        it("should implement needed properties", function() {
            expect(network).to.contain.all.keys(['nodes', 'connections']);
        });

        it("should allow adding of Nodes", function() {
            network.nodes.push(node1);
            network.nodes.push(node2);
            expect(network.nodes.length).to.equal(2);
        })

        it("should allow adding of Connections", function() {
            network.connectNodes(node1, node2);
            expect(network.connections.length).to.equal(1);
            expect(network.connections[0].node1).to.equal(node1.id);
        })

        it("should return JSON", function() {
            var _json = network.json;
            var n2 = JSON.parse(_json);
            expect(n2.description).to.equal("Generic Network");
            expect(n2.nodes.length).to.equal(2);
            expect(n2.connections.length).to.equal(1);
        });
    });

});

