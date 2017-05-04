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
    health: 100,
    size: 30,
    owner: 1,
    lead_attacker: 0
}

var blue_node2 = {
    id: 4,
    health: 100,
    size: 30,
    owner: 1,
    lead_attacker: 0
}

var green_node = {
    id: 2,
    health: 100,
    size: 40,
    owner: 0,
    lead_attacker: 0
}

var red_node = {
    id: 3,
    health: 100,
    size: 40,
    owner: 2,
    lead_attacker: 0
}

var attacks1 = [
    {attackNode: blue_node, targetNode: green_node},
    {attackNode: red_node, targetNode: green_node}
];

var attackValues1 = [
    {attacker: 1, attackPower: 3},
    {attacker: 2, attackPower: 4}
];

var attacks2 = [
    {attackNode: blue_node, targetNode: green_node},
    {attackNode: red_node, targetNode: green_node},
    {attackNode: blue_node2, targetNode: green_node}
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
})



