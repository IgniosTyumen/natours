const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'Max size 40 for name'],
    minlength: [10, 'Min size of name is 10'],

  },
  slug: String,
  secretTour: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have max group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'difficulty must be easy, medium or difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'min rating = 1'],
    max: [5, 'max rating = 5']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'tour must have a price']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
      return val < this.price;
    },
    message:'discount must be lesser that price'}
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'tour must have a summary']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'a tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE
tourSchema.pre('save', function(next) {
  console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});


//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
