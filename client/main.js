import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Images } from '../lib/collection.js';
import { Session } from 'meteor/session';

import './main.html';

// lastScroll = 0;
Session.set('imageLimit', 8);
$(window).scroll(function() {
  if ($(window).height() + $(window).scrollTop() >= $(document).height()) {
    // console.log('window-height' + $(window).height());
    // console.log('window-scrollTop' + $(window).scrollTop());
    // console.log('document' + $(document).height());
    Session.set('imageLimit', Session.get('imageLimit') + 4);
    // console.log(Session.get('imageLimit'));
  }
});

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Template.images.helpers({
  images: function() {
    let userFilter = Session.get('userFilter');
    // console.log(userFilter);
    if (userFilter) {
      return Images.find(
        { createdBy: userFilter },
        { sort: { createdOn: -1, rating: -1 } }
      );
    } else {
      return Images.find(
        {},
        {
          sort: { createdOn: -1, rating: -1 },
          limit: Session.get('imageLimit')
        }
      );
    }
  },
  filteredImage: function() {
    if (Session.get('userFilter')) {
      return true;
    } else {
      return false;
    }
  },
  getUser: function(userId) {
    let user = Meteor.users.findOne({ _id: userId });
    if (user) {
      return user.username;
    } else {
      return 'Anonymous';
    }
  },
  filteredUserName: function() {
    let user = Meteor.users.findOne({ _id: Session.get('userFilter') });
    return user.username;
  }
});

Template.body.helpers({
  userName: function() {
    if (Meteor.user()) {
      return Meteor.user().username;
      //return Meteor.user().emails[0].address;
    } else {
      return 'Anoonymous';
    }
  }
});

Template.images.events({
  'click .js-image': function(event) {
    $(event.target).css('width', '50px');
  },
  'click .js-delete-image': function() {
    $('#' + this._id).hide('slow', () => {
      Images.remove({ _id: this._id });
    });
  },
  'click .js-rating-image': function(event) {
    var rating = $(event.currentTarget).data('userrating');
    console.log(rating);
    let imageId = this.id;
    console.log(imageId);
    Images.update({ _id: imageId }, { $set: { rating: rating } });
  },
  'click .js-show-add-form': function() {
    $('#addImageForm').modal('show');
  },
  'click .js-set-user-filter': function(event) {
    event.preventDefault();
    // console.log(this.createdBy);
    Session.set('userFilter', this.createdBy);
  },
  'click .js-unset-image-filter': function() {
    Session.set('userFilter', undefined);
  }
});

Template.addImageForm.events({
  'submit .js-add-image-form': function(event) {
    event.preventDefault();

    Images.insert(
      {
        src: $('#src').val(),
        alt: $('#alt').val(),
        createdOn: new Date(),
        createdBy: Meteor.user()._id
      },
      () => {
        $('#src').val(' ');
        $('#alt').val(' ');
        $('#addImageForm').modal('hide');
      }
    );
    return false;
  }
});
