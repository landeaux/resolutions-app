import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Resolutions } from '../imports/api/resolutions';

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
