import {fromJS, List, Map} from 'immutable';

export const INITIAL_STATE = fromJS({
    nodes: [],
    connections: [],
    attackList: [],
    users: []
});

export const DEFAULT_NODE = fromJS({
    id: 0,
    size: 30,
    health: 0,
    power: 3,
    owner: 0,
    x: 100,
    y: 100,
    r: 30
});