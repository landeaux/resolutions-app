import { Meteor } from 'meteor/meteor';
import { Resolutions } from '../imports/api/resolutions';

import './methods.js';

Meteor.startup(() => {
  // code to run on server at startup

  Meteor.publish('resolutions', function() {
    return Resolutions.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
});
