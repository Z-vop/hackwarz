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
            // TODO: should we check that attack is not already in the list?
            return state.update('attackList',
                list => list.push(action.attack)
            );
        case 'RESET_ATTACKS':
            return state.set('attackList', new List());

        case 'REMOVE_ATTACKS':
            return state.update('attackList', attacks =>
                attacks.filter((m) => m.get('targetNode') !== action.nodeId)
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
export function newAttack(attackerId, targetId) {
    let newAttack = Attack(attackerId, targetId)
    return {type: 'NEW_ATTACK', attack: newAttack}
}

export function removeAttacks(_nodeId) {
    return {type: 'REMOVE_ATTACKS', nodeId: _nodeId};
}


/* UTILITY */

export function Attack(attacker, target) {
    return fromJS({attackNode: attacker, targetNode: target})
}



/* SELECTORS */

// Get array of attacks
export function getAttacks(_store) {
    return _store.getState().get('attackList');
}

// Returns true if the attack and target Nodes are already in the attackList
export function attackInProgress(_store, attackerId, targetId) {
    var attacks = getAttacks(_store);
    if (attacks.size === 0) return false;
    return attacks.includes(Attack(attackerId, targetId));
}


//
// // Return an array of nodes that are under attack
// export function nodesUnderAttack(_store) {
//     return getAttacks(_store).reduce((list, attack) => {
//         let target = attack.get('targetNode');
//         return (!list.includes(target)) ? list.push(target) : list;
//     }, List([]));
// }
//
// // Return true if node is being attacked
// export function nodeIsUnderAttack(_store, node) {
//     return getAttacks(_store).findIndex(
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
