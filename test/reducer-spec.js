/**
 * Created by cameron on 2/19/17.
 */

import {Map, fromJS} from 'immutable';
import {expect} from 'chai';

import reducer from '../src/reducer.js';

/* Sample data */
const network1 = {
    id: "efd5d81d75b3",
    description: "GenericNetwork",
    nodes: [
        {id: "a904461af54a", description: "node1", r: 30, baseColor: "red", x: 100, y: 100},
        {id: "780bfa02043f", description: "node2", r: 30, baseColor: "#e8e8e8", x: 300, y: 100}
    ],
    connections: [
        {id: "53919a1a5edf", description: "conn1", color: "#154811", node1: "a904461af54a", node2: "780bfa02043f"}
    ]
};
const node3 = {id: "5cf36248305d", description: "node3", r: 40, baseColor: "#e8e8e8", x: 500, y: 100};
const conn2 = {id: "55430f22722d", description: "conn2", color: "#154811", node1: "780bfa02043f", node2: "5cf36248305d" };
const network2 = {
    id: "efd5d81d75b3",
    description: "GenericNetwork",
    nodes: [
        {id: "a904461af54a", description: "node1", r: 30, baseColor: "red", x: 100, y: 100},
        {id: "780bfa02043f", description: "node2", r: 30, baseColor: "#e8e8e8", x: 300, y: 100},
        {id: "5cf36248305d", description: "node3", r: 40, baseColor: "#e8e8e8", x: 500, y: 100}
    ],
    connections: [
        {id: "53919a1a5edf", description: "conn1", color: "#154811", node1: "a904461af54a", node2: "780bfa02043f"},
        {id: "55430f22722d", description: "conn2", color: "#154811", node1: "780bfa02043f", node2: "5cf36248305d" }
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
        const initialState = { id: "efd5d81d75b3" }
        const action = {type: 'ADD_NODE', node: node3}
        const nextState = reducer(initialState, action);
        const expected_state = {
            id: "efd5d81d75b3",
            description: "Network",
            nodes: [{id: "5cf36248305d", description: "node3", r: 40, baseColor: "#e8e8e8", x: 500, y: 100}],
            connections: []
        }
        expect(nextState).to.equal(fromJS(expected_state));
    })

    it('handles ADD_CONNECTION', () => {
        const initialState =  fromJS(network1);
        const action = {type: 'ADD_CONNECTION', connection: conn2 };
        const nextState = reducer(initialState, action);
        const expectedState = fromJS({
            id: "efd5d81d75b3",
            description: "GenericNetwork",
            nodes: [
                {id: "a904461af54a", description: "node1", r: 30, baseColor: "red", x: 100, y: 100},
                {id: "780bfa02043f", description: "node2", r: 30, baseColor: "#e8e8e8", x: 300, y: 100}
            ],
            connections: [
                { id: "53919a1a5edf", description: "conn1", color: "#154811", node1: "a904461af54a", node2: "780bfa02043f"},
                { id: "55430f22722d", description: "conn2", color: "#154811", node1: "780bfa02043f", node2: "5cf36248305d"}
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