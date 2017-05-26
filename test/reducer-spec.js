import {Map, List, fromJS} from 'immutable';
import chai from 'chai';
import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);
import {expect, should} from 'chai'

import makeStore from '../src/store';
import {
    setNetwork, addNode, getNode, setNodeProps, addConnection,
    getAttacks, resetAttacks, newAttack, attackInProgress,
    removeAttacks, nodesUnderAttack, applyAttackCycle
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

    it("should set node props", () => {
        store.dispatch(setNodeProps({
            id: 5,
            health: 20,
            owner: C.BLUE
        }))
        // console.log(store.getState().toJS());
        expect(getNode(store, 5).get('owner')).to.equal(C.BLUE);
        expect(getNode(store, 5).get('power')).to.equal(3);
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
                    {attackNodeId: C.blue_node.id, targetNodeId: C.green_node.id},
                    {attackNodeId: C.red_node.id, targetNodeId: C.green_node.id}
                ])
            )
        })
        it("should work with just numbers", function () {
            store.dispatch(resetAttacks());
            store.dispatch(newAttack(1, 2));
            store.dispatch(newAttack(3, 2));
            expect(getAttacks(store)).to.deep.equal(
                fromJS([
                    {attackNodeId: 1, targetNodeId: 2},
                    {attackNodeId: 3, targetNodeId: 2}
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
                fromJS([{attackNodeId: 3, targetNodeId: 4}])
            );

        });
        it("should not remove attacks if node not in the list", function () {
            store.dispatch(newAttack(1, 2));
            store.dispatch(removeAttacks(5));
            expect(getAttacks(store)).to.deep.equal(
                fromJS([
                    {attackNodeId: 3, targetNodeId: 4},
                    {attackNodeId: 1, targetNodeId: 2}
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
        store.dispatch(newAttack(4, 2));
        store.dispatch(newAttack(3, 2));
        it("should return true if attack and target nodes are in the attack list", function () {
            expect(attackInProgress(store, 4, 2)).to.equal(true);
        });
        it("should return false if attack and target nodes are not in the attack list", function () {
            expect(attackInProgress(store, 2, 4)).to.equal(false);
        })
    });

    describe('getNode()', function() {
        const store = makeStore()
        store.dispatch(setNetwork(C.network2))
        it('should return the correct node given the nodeId value', function() {
            expect(getNode(store, 2)).to.deep.equal(fromJS(C.green_node))
        })
    })

    describe('nodesUnderAttack()', function () {
        const store = makeStore();
        store.dispatch(setNetwork(C.network2))

        store.dispatch(resetAttacks());
        store.dispatch(newAttack(4, 2));
        store.dispatch(newAttack(3, 2));


        it("should return an array of nodes being attacked", function () {
            expect(nodesUnderAttack(store)).to.deep.equal(fromJS([2]));
        });

        it("should return two nodes if two nodes are under attack", function () {
            store.dispatch(newAttack(1,3));
            expect(nodesUnderAttack(store)).to.deep.equal(fromJS([2,3]));
        })
    });
});

describe('Test applyAttackCycle', function () {
    const store = makeStore();
    store.dispatch(setNetwork(C.network2))

    store.dispatch(resetAttacks());
    store.dispatch(newAttack(C.blue_node2.id, C.green_node.id));
    store.dispatch(newAttack(C.red_node.id, C.green_node.id));

    it("should adjust the node health based on the attack values", () => {
        const newHealth = Math.abs(Math.abs(C.green_node.health - C.red_node.power) - C.blue_node2.power)
        const attackChangedOwnership = applyAttackCycle(store, 2)
        expect(attackChangedOwnership).to.equal(false);
        expect(getNode(store, C.green_node.id).get('health')).to.equal(newHealth);
    })

    it("should return true when strongest attack prevails", () => {
        while(!applyAttackCycle(store, 2)) {
            expect(getNode(store, 2).get('health')).to.be.below(C.green_node.size);
        }
        expect(getNode(store, C.green_node.id).get('owner')).to
            .equal((C.red_node.power-C.blue_node2.power) > 0 ? C.RED : C.BLUE);
        expect(getNode(store, C.green_node.id).get('power')).to.equal(C.green_node.power);
    })

})
//

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
//     const store = makeStore();
//     store.dispatch(setNetwork(C.network2))
//
//     store.dispatch(resetAttacks());
//     store.dispatch(newAttack(4, 2));
//     store.dispatch(newAttack(3, 2));
//
//
//     nodesUnderAttack(store).forEach( (targetNodeId) => {
//         if(applyAttackCycle(store, targetNodeId)) {
//             removeAttacks(store, targetNodeId)
//         }
//     });
//
//     it("should set owner 2 as the new owner", function () {
//         expect(node1.owner).to.equal(2); //red
//     })
// })
//









