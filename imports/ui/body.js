import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict'; // for sessions vars
import { Resolutions } from '../api/resolutions';

import './body.html';
import './header.html';
import './resolutions.html';

const dict = new ReactiveDict('dict');

Meteor.subscribe('resolutions');

Template.header.helpers({
  hideFinished() { dict.get('hideFinished'); },
  unfinishedCount() {
    return Resolutions.find({ checked: { $ne: true } }).count();
  },
});

Template.header.events({
  'submit .new-resolution'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const { target } = event;
    const title = target.title.value;

    Meteor.call('addResolution', title);

    // clear the form
    target.title.value = '';
  },
  'change .hide-finished'(event) {
    dict.set('hideFinished', event.target.checked);
  },
});

Template.resolutions.helpers({
  resolutions() {
    if (dict.get('hideFinished')) {
      return Resolutions.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    return Resolutions.find({}, { sort: { createdAt: -1 } });
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
