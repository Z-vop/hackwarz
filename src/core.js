import {fromJS, List, Map} from 'immutable';
import { getAttacks } from './reducer';


// Returns true if the attack and target Nodes are already in the attackList
export function attackInProgress(attacker, target) {
    if (getAttacks().size === 0) return false;
    return getAttacks()
            .filter((a) => a.getIn(['attackNode', 'id']) === attacker.id)
            .filter((a) => a.getIn(['targetNode', 'id']) === target.id)
            .size !== 0
}

// Return an array of nodes that are under attack
export function nodesUnderAttack() {
    return getAttacks().reduce((list, attack) => {
        let target = attack.get('targetNode');
        return (!list.includes(target)) ? list.push(target) : list;
    }, List([]));
}

// Return true if node is being attacked
export function nodeIsUnderAttack(node) {
    return getAttacks().findIndex(
            (attack) => (attack.getIn(['targetNode', 'id']) === node.id)
        ) !== -1
}


export function reduceAttacksToValues(attackList) {

    return attackList.reduce((list, attack) => {
        let targetId = attack.getIn(['targetNode','id']);
        let attackerId = attack.getIn(['attackNode', 'owner']);
        let attackPower = attack.getIn(['attackNode', 'power']);

        // Do we have an entry for this target/attacker combination?
        let i = list.findIndex(
            (av) => (av.get('target') === targetId && av.get('attacker') === attackerId)
        );

        // Add new attack value map or update existing map
        if (i == -1){
            return list.push(Map({
                target: targetId,
                attacker: attackerId,
                power: attackPower
            }))
        } else {
            return list.update(i, m => m.update('power', p => p + attackPower))
        }
    }, List([]))

}

export function applyAttackCycle(attackValues, node) {
    var h = node.get('health');
    var oid = node.get('owner');

    // apply one attack
    function add_attack(a) {
        var p = a.get('power');
        var aid = a.get('attacker');

        // If we own the node support it, otherwise attack it
        oid == aid ? h += p : h -= p

        // If the health drops below zero, switch owners
        if( h < 0 ) { oid = aid; h = -h }
    }

    // get the attacks against this node, and apply each attack
    attackValues
        .filter((a) => a.get('target') === node.get('id'))
        .forEach( a => add_attack(a) )

    const node2 = node.set('owner', oid);
    return node2.set('health', h)
}

