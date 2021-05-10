const mongoose = require('mongoose');
var mongooseTypePhone = require('mongoose-type-phone');
const productSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  senderNumber: {
    type: mongoose.SchemaTypes.Phone,
    required: 'Phone number should be set correctly',
    allowBlank: false,
    allowedNumberTypes: [
      mongooseTypePhone.PhoneNumberType.MOBILE,
      mongooseTypePhone.PhoneNumberType.FIXED_LINE_OR_MOBILE,
    ],
    phoneNumberFormat: mongooseTypePhone.PhoneNumberFormat.INTERNATIONAL, // can be omitted to keep raw input
    defaultRegion: 'BD',
    parseOnGet: false,
  },
  senderAddress: {
    type: String,
    required: false,
  },
  receiverName: {
    type: String,
    required: true,
  },
  receiverNumber: {
    type: mongoose.SchemaTypes.Phone,
    required: 'Phone number should be set correctly',
    allowBlank: false,
    allowedNumberTypes: [
      mongooseTypePhone.PhoneNumberType.MOBILE,
      mongooseTypePhone.PhoneNumberType.FIXED_LINE_OR_MOBILE,
    ],
    phoneNumberFormat: mongooseTypePhone.PhoneNumberFormat.INTERNATIONAL, // can be omitted to keep raw input
    defaultRegion: 'BD',
    parseOnGet: false,
  },
  receiverAddress: {
    type: String,
    required: true,
  },
  otpNumber: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  currentStatus: {
    type: String,
    required: true,
    default: 'Product Received',
  },
});

module.exports = mongoose.model('Product', productSchema);
