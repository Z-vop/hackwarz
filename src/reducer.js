import {fromJS, List, Map} from 'immutable';
import {createStore} from 'redux';

const INITIAL_STATE = fromJS({
    nodes: [],
    connections: [],
    attackList: [],
    users: []
});

const DEFAULT_NODE = fromJS({
    id: 0,
    size: 30,
    health: 0,
    power: 3,
    owner: 0,
    x: 100,
    y: 100,
    r: 30
});

export default function reducer(state = INITIAL_STATE, action) {

    switch (action.type) {
        case 'SET_NETWORK':
            return INITIAL_STATE.merge(fromJS(action.network))

        case 'ADD_NODE':
            const node = DEFAULT_NODE.merge(action.node);
            const nodes = state.get('nodes');
            const new_nodes = nodes.push(Map(node));
            return state.merge({nodes: new_nodes});

        case 'ADD_CONNECTION':
            const new_conns = state.get("connections").push(fromJS(action.connection));
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
                .filter((m) => m.getIn(['targetNode', 'id']) !== action.node.id)
            );
    }
    return state;
}

/* ACTION CREATORS */

export function setNetwork(_net) {
    return {type: 'SET_NETWORK', network: _net}
}

export function addNode(_node) {
    return {type: 'ADD_NODE', node: _node}
}

export function addConnection(_conn) {
    return {type: 'ADD_CONNECTION', connection: _conn}
}

export function resetAttacks() {
    return {type: 'RESET_ATTACKS'}
}


// Create a new attack
export function newAttack(attacker, target) {
    let newAttack = fromJS({attackNode: attacker, targetNode: target})
    return {type: 'NEW_ATTACK', attack: newAttack}
    // if (!store.getState().get('attackList').includes(newAttack)) {
    //     store.dispatch({type: 'NEW_ATTACK', attack: newAttack});
    // }
}

// function removeAttacks(node) {
//     store.dispatch({type: 'REMOVE_ATTACKS', node: node});
// }

/* SELECTORS */

// Get array of attacks
export function getAttacks(_store) {
    return _store.getState().get('attackList');
}




//
//
// // Returns true if the attack and target Nodes are already in the attackList
// function attackInProgress(attacker, target) {
//     if (getAttacks().size === 0) return false;
//     return getAttacks()
//             .filter((a) => a.getIn(['attackNode', 'id']) === attacker.id)
//             .filter((a) => a.getIn(['targetNode', 'id']) === target.id)
//             .size !== 0
// }
//
// // Return an array of nodes that are under attack
// function nodesUnderAttack() {
//     return getAttacks().reduce((list, attack) => {
//         let target = attack.get('targetNode');
//         return (!list.includes(target)) ? list.push(target) : list;
//     }, List([]));
// }
//
// // Return true if node is being attacked
// function nodeIsUnderAttack(node) {
//     return getAttacks().findIndex(
//         (attack) => (attack.getIn(['targetNode', 'id']) === node.id)
//     ) !== -1
// }
//
//
// export function reduceAttacksToValues(attackList) {
//
//     return attackList.reduce((list, attack) => {
//         let targetId = attack.getIn(['targetNode','id']);
//         let attackerId = attack.getIn(['attackNode', 'owner']);
//         let attackPower = attack.getIn(['attackNode', 'power']);
//
//         // Do we have an entry for this target/attacker combination?
//         let i = list.findIndex(
//             (av) => (av.get('target') === targetId && av.get('attacker') === attackerId)
//         );
//
//         // Add new attack value map or update existing map
//         if (i == -1){
//             return list.push(Map({
//                 target: targetId,
//                 attacker: attackerId,
//                 power: attackPower
//             }))
//         } else {
//             return list.update(i, m => m.update('power', p => p + attackPower))
//         }
//     }, List([]))
//
// }
//
// export function applyAttackCycle(attackValues, node) {
//     var h = node.get('health');
//     var oid = node.get('owner');
//
//     // apply one attack
//     function add_attack(a) {
//         var p = a.get('power');
//         var aid = a.get('attacker');
//
//         // If we own the node support it, otherwise attack it
//         oid == aid ? h += p : h -= p
//
//         // If the health drops below zero, switch owners
//         if( h < 0 ) { oid = aid; h = -h }
//     }
//
//     // get the attacks against this node, and apply each attack
//     attackValues
//         .filter((a) => a.get('target') === node.get('id'))
//         .forEach( a => add_attack(a) )
//
//     const node2 = node.set('owner', oid);
//     return node2.set('health', h)
// }
//
