import {Map, List, fromJS} from 'immutable';
import chai from 'chai';
import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);
import {expect, should} from 'chai'

import makeStore from '../src/store';
import {
    setNetwork, addNode, addConnection, getAttacks, resetAttacks, newAttack, attackInProgress,
    removeAttacks
} from '../src/reducer'
import * as C from './constants';

describe('reducer network, node, connection actions', () => {
    const store = makeStore();

    it("should set the network from a JS object", function () {
        store.dispatch(setNetwork(C.network1))
        expect(store.getState().get('nodes').size).to.equal(4)
    })

    it("should add new nodes", () => {
        store.dispatch(addNode(C.red_node2))
        expect(store.getState().get('nodes').size).to.equal(5)
    })

    it("should add connections", () => {
        store.dispatch(addConnection([C.blue_node.id, C.blue_node2.id]))
        store.dispatch(addConnection([C.blue_node2.id, C.green_node.id]))
        expect(store.getState().get('connections').size).to.equal(2)
    })
});


describe("reducer attack actions", () => {
    const store = makeStore();
    store.dispatch(setNetwork(C.network2))

    describe("newAttack", () => {
        it("newAttack should add a new attack", function () {
            store.dispatch(resetAttacks());
            if (!attackInProgress(store, C.blue_node.id, C.green_node.id)) {
                store.dispatch(newAttack(C.blue_node.id, C.green_node.id))
            }
            if (!attackInProgress(store, C.red_node.id, C.green_node.id)) {
                store.dispatch(newAttack(C.red_node.id, C.green_node.id))
            }
            expect(getAttacks(store)).to.deep.equal(
                fromJS([
                    {attackNode: C.blue_node.id, targetNode: C.green_node.id},
                    {attackNode: C.red_node.id, targetNode: C.green_node.id}
                ])
            )
        })
        it("should work with just numbers", function () {
            store.dispatch(resetAttacks());
            store.dispatch(newAttack(1, 2));
            store.dispatch(newAttack(3, 2));
            expect(getAttacks(store)).to.deep.equal(
                fromJS([
                    {attackNode: 1, targetNode: 2},
                    {attackNode: 3, targetNode: 2}
                ])
            )
        })
    })
    describe('removeAttacks', function () {
        it("should remove all attacks for a given node", function () {
            store.dispatch(resetAttacks());
            store.dispatch(newAttack(1, 2));
            store.dispatch(newAttack(3, 4));

            store.dispatch(removeAttacks(2));
            expect(getAttacks(store)).to.deep.equal(
                fromJS([{attackNode: 3, targetNode: 4}])
            );

        });
        it("should not remove attacks if node not in the list", function () {
            store.dispatch(newAttack(1, 2));
            store.dispatch(removeAttacks(5));
            expect(getAttacks(store)).to.deep.equal(
                fromJS([
                    {attackNode: 3, targetNode: 4},
                    {attackNode: 1, targetNode: 2}
                ])
            );
        })
    })
    describe('resetAttacks', function () {
        it("should empty the attacks list", function () {
            store.dispatch(resetAttacks());
            expect(getAttacks(store)).to.be.empty;
        })
    })
})

describe('Test selectors', () => {
    describe('attackInProgress()', function () {
        const store = makeStore();
        store.dispatch(setNetwork(C.network2))

        store.dispatch(resetAttacks());
        store.dispatch(newAttack(1, 2));
        store.dispatch(newAttack(3, 2));
        it("should return true if attack and target nodes are in the attack list", function () {
            expect(attackInProgress(store, 1, 2)).to.equal(true);
        });
        it("should return false if attack and target nodes are not in the attack list", function () {
            expect(attackInProgress(store, 3, 1)).to.equal(false);
        })
    });
});


//
// describe('Test nodesUnderAttack', function () {
//     resetAttacks()
//     newAttack(blue_node, green_node);
//     newAttack(red_node, green_node);
//     var nodeList = [green_node];
//
//     it("should return an array of nodes being attacked", function () {
//         expect(nodesUnderAttack()).to.deep.equal(fromJS(nodeList));
//     });
//
//     it("should return two nodes if two nodes are under attack", function () {
//         newAttack(blue_node, red_node);
//         var nodeList2 = [green_node, red_node];
//         expect(attackInProgress(red_node, green_node)).to.equal(true);
//         expect(attackInProgress(blue_node, red_node)).to.equal(true);
//         expect(nodesUnderAttack()).to.deep.equal(fromJS(nodeList2));
//     })
// });
//
// describe('Test nodeIsUnderAttack', function () {
//     resetAttacks()
//     newAttack(blue_node, green_node);
//     newAttack(red_node, green_node);
//
//     it("should return true if node is in attack list", function () {
//         expect(nodeIsUnderAttack(green_node)).to.equal(true);
//     })
//     it("should return false if node is not in attack list", function () {
//         expect(nodeIsUnderAttack(blue_node)).to.equal(false);
//     })
// })
//
//
//
// describe('Test reduceAttacksToValues', function () {
//
//     var attacks1 = fromJS([
//         {attackNode: blue_node, targetNode: green_node},
//         {attackNode: red_node, targetNode: green_node}
//     ]);
//
//     var attackValues1 = fromJS([
//         {target: green_node.id, attacker: BLUE, power: 3 },
//         {target: green_node.id, attacker: RED, power: 4 }
//     ]);
//
//     var attacks2 = fromJS([
//         {attackNode: blue_node, targetNode: green_node},
//         {attackNode: red_node, targetNode: green_node},
//         {attackNode: blue_node2, targetNode: green_node}
//     ]);
//
//     var attackValues2 = fromJS([
//         {target: green_node.id, attacker: BLUE, power: 8 },
//         {target: green_node.id, attacker: RED, power: 4 }
//     ]);
//
//     var attacks3 = fromJS([
//         {attackNode: blue_node, targetNode: green_node},
//         {attackNode: red_node, targetNode: green_node},
//         {attackNode: blue_node2, targetNode: red_node}
//     ]);
//
//     var attackValues3 = fromJS([
//         {target: green_node.id, attacker: BLUE, power: 3 },
//         {target: green_node.id, attacker: RED, power: 4 },
//         {target: red_node.id, attacker: BLUE, power: 5 }
//     ]);
//
//     it("should reduce attacks to attack values per user", function () {
//         reduceAttacksToValues(attacks1).should.deep.equal(attackValues1);
//     })
//     it("should reduce multiple user attacks to one attack value per user", function () {
//         reduceAttacksToValues(attacks2).should.deep.equal(attackValues2);
//     })
//     it("should compute attacks on multiple nodes", function () {
//         reduceAttacksToValues(attacks3).should.deep.equal(attackValues3);
//     })
// });
//
// /*
//  * OLD STUFF
//  */
//
//
//
//
//
// describe('Test applyAttackCycle', function () {
//
//     var attacks3 = fromJS([
//         {attackNode: blue_node, targetNode: green_node},
//         {attackNode: red_node, targetNode: green_node},
//         {attackNode: blue_node2, targetNode: red_node}
//     ]);
//
//     var attackValues3 = fromJS([
//         {target: green_node.id, attacker: BLUE, power: 3 },
//         {target: green_node.id, attacker: RED, power: 4 },
//         {target: red_node.id, attacker: BLUE, power: 5 }
//     ]);
//
//     // This is how the green node should look after one attack cycle (onFrame cycle)
//     var green_node_after_one_cycle = fromJS({
//         id: 2,
//         health: 1,
//         power: 4,
//         owner: RED //red
//     });
//
//     it("should adjust the node health based on the attack values", function () {
//         applyAttackCycle(attackValues3, fromJS(green_node)).should.deep.equal(green_node_after_one_cycle);
//     })
//
// })
//
// // This is how the green node should look after one attack cycle (onFrame cycle)
// var green_node_conquered = {
//     id: 2,
//     health: 40,
//     size: 40,
//     owner: 0
// };
//
// describe('Test nodeIsConquered', function () {
//     it("should return true if a user has conquered the node", function () {
//         expect(nodeIsConquered(green_node_conquered)).to.equal(true);
//     })
//     it("should return false if healths are still positive", function () {
//         expect(nodeIsConquered(green_node_after_one_cycle)).to.equal(false);
//     })
// })
//
//
// describe('Test Everything', function () {
//     var attacks4 = [
//         {attackNode: blue_node, targetNode: green_node},
//         {attackNode: red_node, targetNode: green_node},
//         {attackNode: blue_node2, targetNode: red_node}
//     ];
//
//     var attackValues = reduceAttacksToValues(getAttacks())
//     nodesUnderAttack().forEach((targetNode) => {
//         if (nodeIsConquered(targetNode)) {
//             setNodeOwnerToWinner(targetNode)
//             removeAttacks(targetNode)
//         } else {
//             applyAttackCycle(attackValues, targetNode);
//         }
//     });
//
//     it("should set owner 2 as the new owner", function () {
//         expect(node1.owner).to.equal(2); //red
//     })
// })
//









