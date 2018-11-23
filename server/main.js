import { Meteor } from 'meteor/meteor';
import { Images } from '../lib/collection.js';

Meteor.startup(() => {
  // code to run on server at startup
  if (Images.find().count() == 0) {
    for (let i = 1; i < 23; i++) {
      Images.insert({
        src: `./img/img_${i}.jpg`,
        alt: `some text for image ${i}`,
        rating: 0
      });
    }
  }

  //create a new Mongo collection
  console.log(Images.find().count());
});


