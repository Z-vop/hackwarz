import {toJS, fromJS, List, Map} from 'immutable';
import {createStore} from 'redux';

const INITIAL_STATE = fromJS({
    nextId: 1,
    nodes: [],
    connections: [],
    attackList: [],
    attackValues: []
});

const DEFAULT_NODE = fromJS({
    id: 0,
    x: 100,
    y: 100,
    r: 30,
    owner: 0,
    health: 30,
    power: 3
});

// What the attack state looks like:
//
// state = {
//     attackList: [
//         {attackNode: 1, targetNode: 2}, // blue
//         {attackNode: 3, targetNode: 2}  // red
//     ],
//     attackValues: [
//         {attackNode: 1, targetNode: 2, attacker: 1, attackPower: 3}, // blue
//         {attackNode: 3, targetNode: 2, attacker: 2, attackPower: 4}  // red
//     ]
// }

function reducer(state = INITIAL_STATE, action) {

    switch (action.type) {
        case 'SET_NETWORK':
            return state.merge(action.network);

        case 'ADD_NODE':
            const node = DEFAULT_NODE.merge(action.node);
            const nodes = state.get('nodes');
            const new_nodes = nodes.push(Map(node));
            return state.merge({nodes: new_nodes});

        case 'ADD_CONNECTION':
            const new_conns = state.get("connections").push(Map(action.connection));
            return state.merge({connections: new_conns});

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
                .filter( (m) => m.getIn(['targetNode','id']) !== action.node.id )
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

// Returns true if the attack and target Nodes are already in the attackList
function attackInProgress(attacker, target) {
    if (getAttacks().size === 0) return false;
    return getAttacks()
            .filter((a) => a.getIn(['attackNode','id']) === attacker.id)
            .filter((a) => a.getIn(['targetNode','id']) === target.id)
            .size !== 0
}

/* OLD STYLE FUNCTIONS */

// Return an array of nodes that are under attack
function nodesUnderAttack() {
    return getAttacks().reduce(function(list, attack){
        const attackNode = attack.get('targetNode');
        if(list.filter((node) => node.get('id') === attackNode.get('id')).length === 0){list.push(attackNode)}
        return list;
    },[]);
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

function applyAttackCycle(attackValues, node) {
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
    applyAttackCycle,
    nodeIsConquered, setNodeOwnerToWinner, removeAttacks
};
