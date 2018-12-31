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
        owner: Meteor.userId(),
      });
    },
    deleteResolution: (id) => {
      check(id, String);
      const res = Resolutions.findOne(id);
      if (res.owner !== Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }
      Resolutions.remove(id);
    },
    updateResolution: (id, checked) => {
      check(id, String);
      check(checked, Boolean);
      const res = Resolutions.findOne(id);
      if (res.owner !== Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }
      Resolutions.update(id, { $set: { checked } });
    },
    setPrivate: (id, priv) => {
      check(id, String);
      check(priv, Boolean);
      const res = Resolutions.findOne(id);
      if (res.owner !== Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      Resolutions.update(id, { $set: { private: priv } });
    },
  });

  Meteor.publish('resolutions', function() {
    return Resolutions.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
});
