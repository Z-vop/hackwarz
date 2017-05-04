/**
 * Created by oliver on 5/3/17.
 */


// Returns true if the attack and target Nodes are already in the attackList
function attackInProgress(attackList, attacker, target) {
    return attackList.filter((a) => a.targetNode.id === target.id).filter((a) => a.attackNode.id === attacker.id).length !== 0;
}

// Return an array of nodes that are under attack
function nodesUnderAttack(attackList) {
    var listOfNodes = [];
    for (var i = 0; i < attackList.length; i++) {
        if (listOfNodes.findIndex( (n) => n === attackList[i].targetNode ) == -1) {
            listOfNodes.push(attackList[i].targetNode);
        }
    }
    return listOfNodes;
}

export {attackInProgress, nodesUnderAttack};
