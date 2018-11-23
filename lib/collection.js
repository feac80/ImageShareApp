import { Mongo } from 'meteor/mongo';

export const Images = new Mongo.Collection('images');

Images.allow({
  insert: function(userId, doc) {
    if (Meteor.user()) {
      if (userId == doc.createdBy) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  remove: function(userId, doc) {
    if (Meteor.user()) {
      if (userId == doc.createdBy) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
});
