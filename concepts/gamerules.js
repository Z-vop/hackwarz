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
    return true;
}

function setNodeOwnerToWinner(node) {
    return 2; // red
}

function removeAttacks(node) {
    return [];
}

export {attackInProgress, nodeIsUnderAttack, nodesUnderAttack, reduceAttacksToValues, beginAttack, applyAttackCycle,
    nodeIsConquered, setNodeOwnerToWinner, removeAttacks};
