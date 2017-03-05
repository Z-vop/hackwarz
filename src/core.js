/**
 * Created by cameron on 2/19/17.
 */

import {fromJS, List, Map} from 'immutable';

export function INITIAL_STATE() {
    return fromJS({
        id: generateId(),
        description: "Network",
        nodes: [],
        connections: []
    });
};

export function generateId() {
    var id = 'xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    return id;
}

export function setNetwork(state, network) {
    return state.merge(network);
}



export function addNode(state, node) {

    this.defense = 100;
    this.attack = 10;
    this.description = "Generic Node";
    this.x = 100;
    this.y = 100;
    this.r = 30;
    this.baseColor = '#e8e8e8';
    this.owner = 0;
    this.health = 100;

    var _owner = 0;

    if(typeof obj == 'object') {
        for(var i in obj) {
            if(obj[i]) { this[i] = obj[i]; }
        }
    };





    const nodes = state.get('nodes');
    const new_nodes = nodes.push(Map(node));
    return state.merge({nodes: new_nodes});
}

export function addConnection(state, newConnection) {
    const new_conns = state.get("connections").push(Map(newConnection));
    return state.merge({connections: new_conns});
}
