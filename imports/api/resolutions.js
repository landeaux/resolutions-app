import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Resolutions = new Mongo.Collection('resolutions');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('resolutions', function resolutionsPublication() {
    return Resolutions.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
  'resolutions.insert'(title) {
    check(title, String);

    Resolutions.insert({
      title,
      createdAt: new Date(),
      owner: this.userId,
    });
  },
  'resolutions.remove'(id) {
    check(id, String);

    const res = Resolutions.findOne(id);

    if (res.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Resolutions.remove(id);
  },
  'resolutions.setChecked'(id, checked) {
    check(id, String);
    check(checked, Boolean);

    const res = Resolutions.findOne(id);

    if (res.private && res.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Resolutions.update(id, { $set: { checked } });
  },
  'resolutions.setPrivate'(id, priv) {
    check(id, String);
    check(priv, Boolean);

    const res = Resolutions.findOne(id);

    if (res.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Resolutions.update(id, { $set: { private: priv } });
  },
});
