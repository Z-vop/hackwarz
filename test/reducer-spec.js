/**
 * Created by cameron on 2/19/17.
 */

import {Map, List, fromJS} from 'immutable';
import {expect} from 'chai';

import reducer from '../src/reducer';

/* Sample data */
const network1 = {
    nextId: 1,
    nodes: [
        {id: 1, r: 30, x: 100, y: 100},
        {id: 2, r: 30, x: 300, y: 100}
    ],
    connections: [
        {id: 5, node1:1, node2: 2}
    ]
};
const node3 = {id: 3, defense: 100, attack: 10, r: 40, x: 500, y: 100 } ;
const conn2 = {id: 6, node1: 2, node2: 3 };
const network2 = {
    nextId: 1,
    nodes: [
        {id: 1, r: 30, x: 100, y: 100},
        {id: 2, r: 30, x: 300, y: 100},
        {id: 3, defense: 100, attack: 10, r: 40, x: 500, y: 100, owner: 0 }
    ],
    connections: [
        {id: 5, node1:1, node2: 2},
        {id: 6, node1: 2, node2: 3 }
    ]
};

describe('reducer', () => {

    it('handles SET_NETWORK', () => {
        const initialState = Map();
        const action = {type: 'SET_NETWORK', network: network1};
        const nextState = reducer(initialState, action);
        expect(nextState).to.equal(fromJS(network1));
    })

    it('handles ADD_NODE', () => {
        const initialState = fromJS(network1);
        const action = {type: 'ADD_NODE', node: node3};
        const nextState = reducer(initialState, action);
        expect(nextState.get('nodes')).to.equal(fromJS(network2).get('nodes'));
    })

    it('handles ADD_CONNECTION', () => {
        const initialState =  fromJS(network1);
        const action = {type: 'ADD_CONNECTION', connection: conn2 };
        const nextState = reducer(initialState, action);
        const expectedState = fromJS({
            nextId: 1,
            nodes: [
                {id: 1, r: 30, x: 100, y: 100},
                {id: 2, r: 30, x: 300, y: 100}
            ],
            connections: [
                {id: 5, node1:1, node2: 2},
                {id: 6, node1: 2, node2: 3 }
            ]
        })
        expect(nextState).to.equal(expectedState);
    })

    it('has an initial state', () => {
        const action = {type: 'SET_NETWORK', network: network1};
        const nextState = reducer(undefined, action);
        expect(nextState).to.equal(fromJS(network1));
    })

    it('can be used with reduce', () => {
        const actions = [
            {type: 'SET_NETWORK', network: network1},
            {type: 'ADD_NODE', node: node3},
            {type: 'ADD_CONNECTION', connection: conn2 }
        ];
        const finalState = actions.reduce(reducer, Map());

        expect(finalState).to.equal(fromJS(network2));
    });

});