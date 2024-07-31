const mongoose = require("mongoose")

const BillSchema = new mongoose.Schema({
    issuedDate:Date,
    dueDate: Date,
    prevRead: {
        type: Number,
        validate: {
          validator: Number.isInteger,
          message: '{VALUE} is not an integer value.'
        }
      },
      presRead: {
        type: Number,
        validate: {
          validator: Number.isInteger,
          message: '{VALUE} is not an integer value.'
        }
      },
      userAcc: {
        type: Number,
        validate: {
          validator: Number.isInteger,
          message: '{VALUE} is not an integer value.'
        }
      },
    Units_consumed: Number,
    Fixed: Number,
    Energy: Number,
    FPPCA: Number,
    Bill: {
      type: Number,
      default: 0 // Default value set to 0
    },
    Credit: Number,
    Interest:Number,
    Total: Number
});

BillSchema.pre('save', function (next) {
    this.Units_consumed = this.presRead - this.prevRead;
    this.Interest = (this.Credit*0.05).toFixed(2);  //5% increment
    console.log("Bill:"+this.Bill);
    console.log("Credit:"+this.Credit);
    console.log("Interest:"+this.Interest);
    this.Total = (this.Credit+this.Interest+this.Bill+0).toFixed(2);
    console.log("Total="+this.Total);
    next();
  });

module.exports = mongoose.model("Bill",BillSchema);