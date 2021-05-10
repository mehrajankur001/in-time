const mongoose = require('mongoose');
var mongooseTypePhone = require('mongoose-type-phone');
const marchantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
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
  address: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('Marchant', marchantSchema);
