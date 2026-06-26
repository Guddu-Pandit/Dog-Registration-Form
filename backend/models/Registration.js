const mongoose = require('mongoose')

const registrationSchema = new mongoose.Schema(
  {
    dogName:    { type: String, required: true, trim: true, minlength: 3 },
    dogBreed:   { type: String, required: true, trim: true },
    dogColor1:  { type: String, required: true, enum: ['Black', 'White', 'Brown', 'Gray'] },
    dogColor2:  { type: String, default: '' },
    dogDob:     { type: Date,   required: true },
    dogGender:  { type: String, required: true, enum: ['male', 'female'] },
    neutered:   { type: String, required: true, enum: ['yes', 'no'] },
    spayed:     { type: String, required: true, enum: ['yes', 'no'] },
    ownerName:  { type: String, required: true, trim: true },
    email:      { type: String, required: true, trim: true, lowercase: true },
    address:    { type: String, required: true, trim: true },
    city:       { type: String, required: true, trim: true },
    state:      { type: String, required: true, trim: true },
    postalCode: { type: String, required: true },
    phoneNum:   { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Registration', registrationSchema)
