import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';
import { ReactiveDict } from 'meteor/reactive-dict'; // for sessions vars
import { Resolutions } from '../api/resolutions';

import './body.html';
import './header.html';
import './resolutions.html';

const dict = new ReactiveDict('dict');

Meteor.subscribe('resolutions');

Template.body.helpers({
  hideFinished() { dict.get('hideFinished'); },
});

Template.body.events({
  'submit .new-resolution'(event) {
    const e = event;
    const title = e.target.title.value;

    Meteor.call('addResolution', title);

    // clear the form
    e.target.title.value = '';

    // keeps page from refreshing because of submit event
    return false;
  },
  'change .hide-finished'(event) {
    dict.set('hideFinished', event.target.checked);
  },
});

Template.resolutions.helpers({
  resolutions() {
    if (dict.get('hideFinished')) {
      return Resolutions.find({ checked: { $ne: true } });
    }
    return Resolutions.find();
  },
});

Template.resolution.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
});

Template.resolution.events({
  'click .toggle-checked'() {
    Meteor.call('updateResolution', this._id, !this.checked);
  },
  'click .delete'() {
    Meteor.call('deleteResolution', this._id);
  },
  'click .toggle-private'() {
    Meteor.call('setPrivate', this._id, !this.private);
  },
});

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});