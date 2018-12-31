import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

Meteor.startup(() => {
  // code to run on server at startup
  const Resolutions = new Mongo.Collection('resolutions');

  Meteor.methods({
    addResolution: (title) => {
      check(title, String);
      Resolutions.insert({
        title,
        createdAt: new Date(),
      });
    },
    deleteResolution: (id) => {
      check(id, String);
      Resolutions.remove(id);
    },
    updateResolution: (id, checked) => {
      check(id, String);
      check(checked, Boolean);
      Resolutions.update(id, { $set: { checked } });
    },
  });

  Meteor.publish('resolutions', function() {
    return Resolutions.find();
  });
});
