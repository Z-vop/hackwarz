/**
 * Created by cameron on 2/19/17.
 */

import {fromJS, List, Map} from 'immutable';
import {expect} from 'chai';

import {generateId, setNetwork, addNode, addConnection} from '../src/core.js';

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
const conn2 = { id: "55430f22722d", description: "conn2", color: "#154811", node1: "780bfa02043f", node2: "5cf36248305d" };

describe('state logic', () => {

    describe('setNetwork', () => {
        it('replaces the network map in the state', () => {
            const state = Map();
            const nextState = setNetwork(state, network1);
            expect(nextState).to.equal(fromJS(network1));
        })
    })

    describe('addNode', () => {
        it('can add a node to the network', () => {
            const state = fromJS(network1);
            const nextState = addNode(state, node3);
            const expected_state = fromJS({
                id: "efd5d81d75b3",
                description: "GenericNetwork",
                nodes: [
                    {id: "a904461af54a", description: "node1", r: 30, baseColor: "red", x: 100, y: 100},
                    {id: "780bfa02043f", description: "node2", r: 30, baseColor: "#e8e8e8", x: 300, y: 100},
                    {id: "5cf36248305d", description: "node3", r: 40, baseColor: "#e8e8e8", x: 500, y: 100}
                ],
                connections: [
                    { id: "53919a1a5edf", description: "conn1", color: "#154811", node1: "a904461af54a", node2: "780bfa02043f"}
                ]
            })
            expect(nextState).to.equal(expected_state);
        })
        it('does not mutate the state', () => {
            const state = fromJS(network1);
            const nextState = addNode(state, node3);
            expect(state).to.equal(fromJS(network1));
        })
    })

    describe('addConnection', () => {
        it('adds a connection to the network', () => {
            const state = fromJS(network1);
            const nextState = addConnection(state, conn2);
            const expected_state = fromJS({
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
            expect(nextState).to.equal(expected_state);
        })
    })

});