const mongoose = require('mongoose');

const regionHistSchema = new mongoose.Schema({
  RegionCode: {
    type: String,
    required: true
  },
  TimePeriod: {
    type: Date,
    required: true,
    get: (val) => val ? val.toISOString().slice(0, 7) : null, // Getter to return YYYY-MM
    set: (val) => val ? new Date(`${val}-01`) : null // Setter to parse YYYY-MM and set to the first day of the month
  },
  TotalUnitsConsumed: {
    type: Number,
    default: 0
  },
  ProjectedEarnings: {
    type: Number,
    default: 0
  },
  CollectedEarnings: {
    type: Number,
    default: 0
  }
});


module.exports = mongoose.model('RegionHist', regionHistSchema);
