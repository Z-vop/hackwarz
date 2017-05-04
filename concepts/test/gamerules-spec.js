/**
 * Created by oliver on 5/3/17.
 */

var chai = require('chai');
var expect = require('chai').expect;
var should = require('chai').should();

import {attackInProgress, nodesUnderAttack} from '../gamerules'

/* SCAFFOLDING */

var blue_node = {
    id: 1,
    health: 0,
    size: 30,
    owner: 1,
    owner1health: 0,
    owner2health: 0
}

var blue_node2 = {
    id: 4,
    health: 0,
    size: 50,
    owner: 1,
    owner1health: 0,
    owner2health: 0
}

var green_node = {
    id: 2,
    health: 0,
    size: 40,
    owner: 0,
    owner1health: 0,
    owner2health: 0
}

var red_node = {
    id: 3,
    health: 0,
    size: 40,
    owner: 2,
    owner1health: 0,
    owner2health: 0
};

var attacks1 = [
    {attackNode: blue_node, targetNode: green_node},
    {attackNode: red_node, targetNode: green_node}
];

var attackValues1 = [
    {attacker: 1, attackPower: 3}, // blue
    {attacker: 2, attackPower: 4}  // red
];

var attacks2 = [
    {attackNode: blue_node, targetNode: green_node},
    {attackNode: red_node, targetNode: green_node},
    {attackNode: blue_node2, targetNode: green_node}
];

var attackValues2 = [
    {attacker: 1, attackPower: 8}, // blue
    {attacker: 2, attackPower: 4}  // red
];

var attacks3 = [
    {attackNode: blue_node, targetNode: green_node},
    {attackNode: red_node, targetNode: green_node},
    {attackNode: blue_node2, targetNode: red_node}
];


/* TESTS */

describe('Test attackInProgress', function () {
    it("should return true if attack and target nodes are in the attack list", function() {
        expect(attackInProgress(attacks1, blue_node, green_node)).to.equal(true);
    });
    it("should return false if attack and target nodes are not in the attack list", function() {
        expect(attackInProgress(attacks1, blue_node, red_node)).to.equal(false);
    })
});

describe('Test nodesUnderAttack', function(){
    var nodeList = [green_node];

    it("should return an array of nodes being attacked", function() {
        expect(nodesUnderAttack(attacks1)).to.deep.equal(nodeList);
    });

    var nodeList2 = [green_node, red_node];
    it("should return two nodes if two nodes are under attack", function() {
        expect(nodesUnderAttack(attacks3)).to.deep.equal(nodeList2);
    })
});

describe('Test reduceAttacksToValues', function() {
    it("should reduce attacks to attack values per user", function() {
        reduceAttacksToValues(attacks1).should.deep.equal(attackValues1);
    })
    it("should reduce multiple user attacks to one attack value per user", function() {
        reduceAttacksToValues(attacks2).should.deep.equal(attackValues2);
    })
});


var green_node_at_begin_attack = {
    id: 2,
    health: 0,
    size: 40,
    owner: 0,
    owner1health: 30,
    owner2health: 40
}

describe('Test beginAttack', function() {
    it("should return target node with the owner healths to starting values", function() {
        beginAttack(attacks1).should.deep.equal(green_node_at_begin_attack);
    })
})



