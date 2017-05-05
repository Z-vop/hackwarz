/**
 * Created by oliver on 5/3/17.
 */

var chai = require('chai');
var expect = require('chai').expect;
var should = require('chai').should();

import {attackInProgress, nodesUnderAttack, nodeIsUnderAttack, reduceAttacksToValues, beginAttack, applyAttackCycle,
    nodeIsConquered, setNodeOwnerToWinner, removeAttacks} from '../gamerules'

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
    it("should return true if attack and target nodes are in the attack list", function () {
        expect(attackInProgress(attacks1, blue_node, green_node)).to.equal(true);
    });
    it("should return false if attack and target nodes are not in the attack list", function () {
        expect(attackInProgress(attacks1, blue_node, red_node)).to.equal(false);
    })
});

describe('Test nodesUnderAttack', function () {
    var nodeList = [green_node];

    it("should return an array of nodes being attacked", function () {
        expect(nodesUnderAttack(attacks1)).to.deep.equal(nodeList);
    });

    var nodeList2 = [green_node, red_node];
    it("should return two nodes if two nodes are under attack", function () {
        expect(nodesUnderAttack(attacks3)).to.deep.equal(nodeList2);
    })
});

describe('Test nodeIsUnderAttack', function() {
    it("should return true if node is in attack list", function() {
        expect(nodeIsUnderAttack(attacks3, red_node)).to.equal(true);
    })
    it("should return false if node is no in attack list", function() {
        expect(nodeIsUnderAttack(attacks3, blue_node)).to.equal(false);
    })
})


describe('Test reduceAttacksToValues', function () {
    it("should reduce attacks to attack values per user", function () {
        // attackValuesArray = reduceAttacksToValues(attacks)
        reduceAttacksToValues(attacks1).should.deep.equal(attackValues1);
    })
    it("should reduce multiple user attacks to one attack value per user", function () {
        reduceAttacksToValues(attacks2).should.deep.equal(attackValues2);
    })
});

// This is how the green_node should look when the attack1 begins
var green_node_at_begin_attack = {
    id: 2,
    health: 0,
    size: 40,
    owner: 0,
    owner1health: 40,
    owner2health: 40
}

describe('Test beginAttack', function () {
    it("should return target node with the owner healths to starting values", function () {
        // newNode = beginAttack(node)
        beginAttack(green_node).should.deep.equal(green_node_at_begin_attack);
    })
})

// This is how the green node should look after one attack cycle (onFrame cycle)
var green_node_after_one_cycle = {
    id: 2,
    health: 0,
    size: 40,
    owner: 0,
    owner1health: 37,
    owner2health: 36
};

describe('Test applyAttackCycle', function () {
    it("should adjust the node health based on the attack values", function () {
        // newNode = applyAttackCycle(attackValues, node)
        applyAttackCycle(attackValues1, green_node_at_begin_attack).should.deep.equal(green_node_after_one_cycle);
        // TODO: What should the displayed node health be?
    })
    it("should handle compose with beginAttack()", function () {
        // newNode = applyAttackCycle(attackValues, node)
        var newNode = applyAttackCycle(attackValues2, beginAttack(green_node));
        expect(newNode.owner1health).to.equal(32);
        expect(newNode.owner2health).to.equal(36);
    })
})

// This is how the green node should look after one attack cycle (onFrame cycle)
var green_node_conquered = {
    id: 2,
    health: 0,
    size: 40,
    owner: 0,
    owner1health: 1,
    owner2health: -1
};

describe('Test nodeIsConquered', function () {
    it("should return true if a user has conquered the node", function () {
        expect(nodeIsConquered(green_node_conquered)).to.equal(true);
    })
    it("should return false if healths are still positive", function () {
        expect(nodeIsConquered(green_node_after_one_cycle)).to.equal(false);
    })
})

describe('Test Everything', function () {
    var attacks4 = [
        {attackNode: blue_node, targetNode: green_node},
        {attackNode: red_node, targetNode: green_node},
        {attackNode: blue_node2, targetNode: red_node}
    ];

    // This happens when a user attacks a node
    var node1 = beginAttack(green_node)

    // This happens for every OnFrame cycle
    nodesUnderAttack(attacks4).forEach((attackedNode) => {
        while (nodeIsUnderAttack(attacks4, attackedNode)) {
            if (nodeIsConquered(attackedNode)) {
                setNodeOwnerToWinner(attackedNode)
                attacks4 = removeAttacks(attackedNode)
            } else {
                node1 = applyAttackCycle(reduceAttacksToValues(attacks4), attackedNode);
            }
        }
    });

    it("should set owner 2 as the new owner", function () {
        expect(node1.owner).to.equal(2); //red
    })
})










