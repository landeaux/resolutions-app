/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';

import { Resolutions } from './resolutions.js';

if (Meteor.isServer) {
  describe('Resolutions', () => {
    describe('methods', () => {
      const userId = Random.id();
      let resolutionId;

      beforeEach(() => {
        Resolutions.remove({});
        resolutionId = Resolutions.insert({
          title: 'test resolution',
          createdAt: new Date(),
          owner: userId,
        });
      });

      it('can delete owned resolution', () => {
        // Find the internal implementation of the resolution method so we can
        // test it in isolation
        const deleteResolution = Meteor.server.method_handlers['resolutions.remove'];

        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        // Run the method with `this` set to the fake invocation
        deleteResolution.apply(invocation, [resolutionId]);

        // Verify that the method does what we expected
        assert.equal(Resolutions.find().count(), 0);
      });
    });
  });
}
