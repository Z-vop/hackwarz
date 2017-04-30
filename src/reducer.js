/**
 * Created by cameron on 2/19/17.
 */

import {fromJS, List, Map} from 'immutable';

export function generateId() {
    var id = 'xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    return id;
}

export function INITIAL_STATE() {
    return fromJS({
        id: generateId(),
        description: "Network",
        nodes: [],
        connections: []
    });
};

function DEFAULT_NODE() {
    return fromJS({
        id: generateId(),
        defense: 100,
        attack: 10,
        description: "Node",
        x: 100,
        y: 100,
        r: 30,
        baseColor: '#e8e8e8',
        owner: 0
    })
}

export default function reducer(initialState = INITIAL_STATE(), action) {

    const state = INITIAL_STATE().merge(initialState);

    switch (action.type) {
        case 'SET_NETWORK':
            return state.merge(action.network);

        case 'ADD_NODE':
            const node = DEFAULT_NODE().merge(action.node);
            const nodes = state.get('nodes');
            const new_nodes = nodes.push(Map(node));
            return state.merge({nodes: new_nodes});

        case 'ADD_CONNECTION':
            const new_conns = state.get("connections").push(Map(action.connection));
            return state.merge({connections: new_conns});
    }
    return state;
}