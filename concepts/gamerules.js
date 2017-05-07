import {toJS, fromJS, List, Map} from 'immutable';
import {createStore} from 'redux';

// What the state looks like:
//
// state = {
//     attackList: [
//         {attackNode: 1, targetNode: 2},
//         {attackNode: 3, targetNode: 2}
//     ],
//     attackValues: [
//         {attacker: 1, attackPower: 3}, // blue
//         {attacker: 2, attackPower: 4}  // red
//     ]
// }

const INITIAL_STATE = fromJS({
    attackList: [],
    attackValues: []
});

function reducer(state = INITIAL_STATE, action) {

    switch (action.type) {
        case 'NEW_ATTACK':
            return state.update('attackList',
                list => list.push(action.attack)
            );
        case 'RESET_ATTACKS':
            return state.set('attackList', new List());
        case 'REMOVE_ATTACKS':
            // get the attackList
            // remove were targetNode = action.node
            return state.update('attackList', attacks => attacks
                .filter( (m) => m.getIn(['targetNode','id']) != action.node.id )
            );
    }
    return state;
}

const store = createStore(reducer);

/* ACTION CREATORS */

// Get array of attacks
function getAttacks() {
    return store.getState().get('attackList');
}

function resetAttacks() {
    store.dispatch({type: 'RESET_ATTACKS'});
}

// Create a new attack
function newAttack(attacker, target) {
    let newAttack = fromJS({attackNode: attacker, targetNode: target});
    if(!store.getState().get('attackList').includes(newAttack)) {
        store.dispatch({type: 'NEW_ATTACK', attack: newAttack});
    }
}

function removeAttacks(node) {
    store.dispatch({type: 'REMOVE_ATTACKS', node: node});
}

/* OLD STYLE FUNCTIONS */

// Returns true if the attack and target Nodes are already in the attackList
function attackInProgress(attackList, attacker, target) {
    return attackList.filter((a) => a.targetNode.id === target.id).filter((a) => a.attackNode.id === attacker.id).length !== 0;
}

// Return an array of nodes that are under attack
function nodesUnderAttack(attackList) {
    var listOfNodes = [];
    for (var i = 0; i < attackList.length; i++) {
        if (listOfNodes.findIndex((n) => n === attackList[i].targetNode) == -1) {
            listOfNodes.push(attackList[i].targetNode);
        }
    }
    return listOfNodes;
}

// Return true if node is being attacked
function nodeIsUnderAttack(attackList, node) {
    return attackList.findIndex(
            (attack) => (attack.targetNode == node)
        ) != -1
}

function reduceAttacksToValues(array) {
    var attackValues = new Array(10).fill(0);

    for (var n = 0; n < array.length; n++) {
        var attackPower = array[n].attackNode.size / 10;
        var attackOwner = array[n].attackNode.owner;
        attackValues[attackOwner] += attackPower;
    }

    return attackValues
        .map((power, index) => ({attacker: index, attackPower: power}))
        .filter((n) => (n.attackPower != 0))
}

function beginAttack(node) {
    node.owner1health = node.size;
    node.owner2health = node.size;
    return node;
}

function applyAttackCycle(attackValues, node) {
    node.owner1health -= (attackValues[0].attackPower);
    node.owner2health -= (attackValues[1].attackPower);
    return node;
}

function nodeIsConquered(node) {
    return node.owner1health <= 0 || node.owner2health <= 0;
}

function setNodeOwnerToWinner(node) {
    return 2; // red
}



export {
    getAttacks, newAttack, resetAttacks,
    attackInProgress, nodeIsUnderAttack, nodesUnderAttack, reduceAttacksToValues,
    beginAttack, applyAttackCycle,
    nodeIsConquered, setNodeOwnerToWinner, removeAttacks
};
