const mongoose = require("mongoose");
const Bill = require("./BillModel");

const UserHistorySchema = new mongoose.Schema({
  User_ACC_ID: {
    type: Number,
    required: true
  },
  Average_units: {
    type: Number,
    default: 0
  },
  Credit: {
    type: Number,
    required: true
  },
  Latest_Bill_ID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bill"
  }
});

// Create a pre-save middleware to calculate Average_units
UserHistorySchema.pre('save', async function (next) {
  try {
    // Find the latest 12 bills, sort them in descending order by date
    const latestBills = await Bill.find({userAcc:this.User_ACC_ID}).sort({ issuedDate: -1 }).limit(12);
    // Calculate the average units consumed
    const totalUnits = latestBills.reduce((acc, bill) => acc + bill.Units_consumed, 0);
    if(latestBills.length<12)
      this.Average_units=0;
    else
      this.Average_units = Math.round(totalUnits / 12);
    next();
  } 
  catch (error) {
    next(error);
  }
});

const UserHistory = mongoose.model("UserHistory", UserHistorySchema);

module.exports = UserHistory;