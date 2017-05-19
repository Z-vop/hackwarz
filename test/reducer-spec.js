/**
 * Created by oliver on 5/3/17.
 */

import {Map, List, fromJS} from 'immutable';
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
var expect = require('chai').expect;
var should = require('chai').should();

import {
    getAttacks, newAttack, resetAttacks,
    attackInProgress, nodesUnderAttack, nodeIsUnderAttack, reduceAttacksToValues, applyAttackCycle,
    nodeIsConquered, setNodeOwnerToWinner, removeAttacks
} from '../src/reducer'

/* SCAFFOLDING */

const GREEN = 0;
const BLUE = 1;
const RED = 2;

var blue_node = {
    id: 1,
    health: 30,
    size: 30,
    owner: BLUE
}

var blue_node2 = {
    id: 4,
    health: 50,
    size: 50,
    owner: BLUE
}

var green_node = {
    id: 2,
    health: 40,
    size: 40,
    owner: GREEN
}

var red_node = {
    id: 3,
    health: 40,
    size: 40,
    owner: RED
};

var attacks1 = [
    {attackNode: blue_node, targetNode: green_node},
    {attackNode: red_node, targetNode: green_node}
];

var attackValues1 = [
    {attackNode: blue_node, targetNode: green_node, attacker: BLUE, attackPower: 3}, // blue
    {attackNode: red_node, targetNode: green_node, attacker: RED, attackPower: 4}  // red
];

var attacks2 = [
    {attackNode: blue_node, targetNode: green_node},
    {attackNode: red_node, targetNode: green_node},
    {attackNode: blue_node2, targetNode: green_node}
];

var attackValues2 = [
    {attackNode: blue_node, targetNode: green_node, attacker: BLUE, attackPower: 8}, // blue
    {attackNode: red_node, targetNode: green_node, attacker: RED, attackPower: 4}  // red
];

var attacks3 = [
    {attackNode: blue_node, targetNode: green_node},
    {attackNode: red_node, targetNode: green_node},
    {attackNode: blue_node2, targetNode: red_node}
];

var attackValues3 = [
    {attackNode: blue_node, targetNode: green_node, attacker: BLUE, attackPower: 3},
    {attackNode: red_node, targetNode: green_node, attacker: RED, attackPower: 4},
    {attackNode: blue_node2, targetNode: red_node, attacker: BLUE, attackPower: 5}
]


/* TESTS */

describe("newAttack action", function () {

    it("should add a new attack", function () {
        resetAttacks();
        newAttack(blue_node, green_node);
        newAttack(red_node, green_node);
        getAttacks().should.deep.equal(
            fromJS([
                {attackNode: blue_node, targetNode: green_node},
                {attackNode: red_node, targetNode: green_node}
            ])
        )
    })

    it("should work with just numbers", function () {
        resetAttacks();
        newAttack(1, 2);
        newAttack(3, 2);
        getAttacks().should.deep.equal(
            fromJS([
                {attackNode: 1, targetNode: 2},
                {attackNode: 3, targetNode: 2}
            ])
        )
    })
})

describe('resetAttacks', function () {
    it("should empty the attacks list", function () {
        resetAttacks()
        expect(getAttacks()).to.be.empty;
    })
})

describe('Test removeAttacks', function () {
    it("should remove all attacks for a given node", function () {
        resetAttacks()
        newAttack(blue_node, green_node);
        newAttack(red_node, blue_node);
        removeAttacks(blue_node);
        expect(getAttacks()).to.deep.equal(
            fromJS([{attackNode: blue_node, targetNode: green_node}])
        );

    });
    it("should not remove attacks if node not in the list", function () {
        resetAttacks()
        newAttack(blue_node, green_node);
        newAttack(red_node, green_node);
        removeAttacks(red_node);
        expect(getAttacks()).to.deep.equal(fromJS(attacks1));
    })
})

describe('Test attackInProgress', function () {
    resetAttacks()
    newAttack(blue_node, green_node);
    newAttack(red_node, green_node);
    it("should return true if attack and target nodes are in the attack list", function () {
        expect(attackInProgress(blue_node, green_node)).to.equal(true);
    });
    it("should return false if attack and target nodes are not in the attack list", function () {
        expect(attackInProgress(blue_node, red_node)).to.equal(false);
    })
});

describe('Test nodesUnderAttack', function () {
    resetAttacks()
    newAttack(blue_node, green_node);
    newAttack(red_node, green_node);
    var nodeList = [green_node];

    it("should return an array of nodes being attacked", function () {
        expect(nodesUnderAttack()).to.deep.equal(fromJS(nodeList));
    });

    it("should return two nodes if two nodes are under attack", function () {
        newAttack(blue_node, red_node);
        var nodeList2 = [green_node, red_node];
        expect(attackInProgress(red_node, green_node)).to.equal(true);
        expect(attackInProgress(blue_node, red_node)).to.equal(true);
        expect(nodesUnderAttack()).to.deep.equal(fromJS(nodeList2));
    })
});

describe('Test nodeIsUnderAttack', function () {
    resetAttacks()
    newAttack(blue_node, green_node);
    newAttack(red_node, green_node);
    var nodeList = [green_node];

    it("should return true if node is in attack list", function () {
        expect(nodeIsUnderAttack(green_node)).to.equal(true);
    })
    it("should return false if node is no in attack list", function () {
        expect(nodeIsUnderAttack(blue_node)).to.equal(false);
    })
})


/*
 * OLD STUFF
 */





describe('Test reduceAttacksToValues', function () {
    it("should reduce attacks to attack values per user", function () {
        // attackValuesArray = reduceAttacksToValues(attacks)
        reduceAttacksToValues(attacks1).should.deep.equal(attackValues1);
    })
    it("should reduce multiple user attacks to one attack value per user", function () {
        reduceAttacksToValues(attacks2).should.deep.equal(attackValues2);
    })
});

// This is how the green node should look after one attack cycle (onFrame cycle)
var green_node_after_one_cycle = {
    id: 2,
    health: 39,
    size: 40,
    owner: RED //red
};

describe('Test applyAttackCycle', function () {
    it("should adjust the node health based on the attack values", function () {
        applyAttackCycle(attackValues1, green_node).should.deep.equal(green_node_after_one_cycle);
    })
    it("should handle compose with beginAttack()", function () {
        // newNode = applyAttackCycle(attackValues, node)
        var newNode = applyAttackCycle(attackValues2, beginAttack(green_node));
        expect(newNode.health).to.equal(36);
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

    // // This happens when a user attacks a node
    // var node1 = beginAttack(green_node);
    //
    // // This happens for every OnFrame cycle
    // nodesUnderAttack(attacks4).forEach((attackedNode) => {
    //     while (nodeIsUnderAttack(attacks4, attackedNode)) {
    //         if (nodeIsConquered(attackedNode)) {
    //             setNodeOwnerToWinner(attackedNode)
    //             attacks4 = removeAttacks(attacks4, attackedNode)
    //         } else {
    //             node1 = applyAttackCycle(reduceAttacksToValues(attacks4), attackedNode);
    //         }
    //     }
    // });

    // it("should set owner 2 as the new owner", function () {
    //     expect(node1.owner).to.equal(2); //red
    // })
})










