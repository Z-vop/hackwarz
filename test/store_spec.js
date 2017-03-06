/**
 * Created by cameron on 3/4/17.
 */

import {Map, fromJS} from 'immutable';
import {expect} from 'chai';

import {INITIAL_STATE} from '../src/reducer';
import makeStore from '../src/store';

describe('store', () => {

    it('is a Redux store configured with the correct reducer', () => {
        const store = makeStore();
        const state1 = store.getState();
        const state2 = INITIAL_STATE();

        expect(state1.description).to.equal(state2.description); /* TODO: Can't compare whole state because of ID #s */
    });

});
