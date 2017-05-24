import {Map, List, fromJS} from 'immutable';
import chai from 'chai';
import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);
import {expect, should} from 'chai'

import makeStore from '../src/store';

describe('store', () => {
    const store = makeStore();

    it('is a Redux store configured with the correct reducer', () => {
        Map.isMap(store.getState());
        store.getState().keySeq().includes('nodes');
    });
});