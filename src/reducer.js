import {fromJS, List, Map} from 'immutable';
import {createStore} from 'redux';
import { INITIAL_STATE, DEFAULT_NODE } from "./constants"

export default function reducer(state = INITIAL_STATE, action) {

    switch (action.type) {
        case 'SET_NETWORK':
            return INITIAL_STATE.merge(fromJS(action.network))

        case 'ADD_NODE':
            const node = DEFAULT_NODE.merge(action.node);
            const nodes = state.get('nodes');
            const new_nodes = nodes.push(Map(node));
            return state.merge({nodes: new_nodes});

        case 'SET_NODE_PROPS':
            const nodeId = action.nodeProps.id
            const nodeIndex = state.get('nodes').findIndex(
                (node) => node.get('id') == nodeId)
            return state.mergeDeepIn(['nodes', nodeIndex], action.nodeProps)

        case 'ADD_CONNECTION':
            const new_conns = state.get("connections").push(fromJS(action.connection));
            return state.merge({connections: new_conns});

        case 'NEW_ATTACK':
            // TODO: should we check that attack is not already in the list?
            // TODO: Check that the attack is along a connection
            return state.update('attackList',
                list => list.push(action.attack)
            );
        case 'RESET_ATTACKS':
            return state.set('attackList', new List());

        case 'REMOVE_ATTACKS':
            return state.update('attackList', attacks =>
                attacks.filter((m) => m.get('targetNodeId') !== action.nodeId)
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

export function setNodeProps(_np) {
    return {type: 'SET_NODE_PROPS', nodeProps: _np}
}

export function addConnection(_conn) {
    return {type: 'ADD_CONNECTION', connection: _conn}
}

export function resetAttacks() {
    return {type: 'RESET_ATTACKS'}
}

export function newAttack(attackerId, targetId) {
    let newAttack = Attack(attackerId, targetId)
    return {type: 'NEW_ATTACK', attack: newAttack}
}

export function removeAttacks(_nodeId) {
    return {type: 'REMOVE_ATTACKS', nodeId: _nodeId};
}


/* UTILITY */

export function Attack(attacker, target) {
    return fromJS({attackNodeId: attacker, targetNodeId: target})
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

export function getNode(_store, nodeId) {
    return _store.getState()
        .get('nodes')
        .find( (node) => node.get('id') == nodeId )
}

// Return an array of nodes that are under attack
export function nodesUnderAttack(_store) {
    return getAttacks(_store).reduce((list, attack) => {
        let target = attack.get('targetNodeId');
        return (!list.includes(target)) ? list.push(target) : list;
    }, List([]));
}

export function applyAttackCycle(_store, nodeId) {
    var t = getNode(_store, nodeId).toJS(); // targetNode

    function apply_attack(attack) {  // apply one attack
        var a = getNode(_store, attack.get('attackNodeId')).toJS(); // attackingNode
        // console.log("1 node: " + nodeId + " health: " + health + " owner: " + ownerId + " attackOwnerId: " + attackOwnerId + " with: " + power);

        // If we own the node support it, otherwise attack it
        t.owner === a.owner ? t.health += a.power : t.health -= a.power

        // If the health drops below zero, switch owners and reverse the health
        if( t.health < 0 ) { t.owner = a.owner; t.health = -t.health }
        // console.log("2 node: " + nodeId + " health: " + health + " owner: " + ownerId );
        // console.log(" ");
    }

    // get the attacks against this node, and apply each attack
    getAttacks(_store)
        .filter((attack) => attack.get('targetNodeId') === t.id)
        .forEach( (a) => apply_attack(a) )

    // If the health goes above the size, cap it
    // important: do it here and not for each attack or attack will never finish in some cases
    if( t.health > t.size ) { t.health = t.size }

    // Update store with results
    _store.dispatch(setNodeProps({id: t.id, owner: t.owner, health: t.health}))

    // return true means that node is at full health (conquered)
    return (t.health === t.size)
}
