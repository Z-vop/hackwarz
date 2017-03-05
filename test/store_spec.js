/**
 * Created by cameron on 3/4/17.
 */

import {Map, fromJS} from 'immutable';
import {expect} from 'chai';
import {INITIAL_STATE} from '../src/core.js';

import makeStore from '../src/store';

describe('store', () => {

    it('is a Redux store configured with the correct reducer', () => {
        const store = makeStore();
        const state1 = store.getState();
        const state2 = INITIAL_STATE();

        expect(state1.description).to.equal(state2.description);



    });

});
