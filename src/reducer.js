
import {fromJS, List, Map} from 'immutable';

const INITIAL_STATE = fromJS({
        nextId: 1,
        nodes: [],
        connections: []
    });

const DEFAULT_NODE = fromJS({
        id: 0,
        defense: 100,
        attack: 10,
        x: 100,
        y: 100,
        r: 30,
        owner: 0
    });

export default function reducer(initialState = INITIAL_STATE, action) {

    // ensure that the state has minimum set of properties
    const state = INITIAL_STATE.merge(initialState);

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
    }
    return state;
}
