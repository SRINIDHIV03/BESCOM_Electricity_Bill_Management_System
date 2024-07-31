//require("dotenv").config();
const dbService = require('./SQL_connect');
// const http = require('http');
// const url = require('url');
const express = require('express');
const express_session=require("express-session")
const cookie = require("cookie-parser");
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');


const Bill = require("./BillModel"); // Replace with the actual file path where your Bill model is defined
const UserHistory = require("./UserHist"); // Replace with the actual file path where your UserHistory model is defined
const RegionHist = require('./RegionHist');

mongoose.connect("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(express.json());

//app.use(cookie);
app.use(express_session({
    secret: 'test',  // a secret string used to sign the session ID cookie
    resave: false,  // don't save session if unmodified
    saveUninitialized: false,  // don't create session until something stored
    cookie: {
        path: '/', // Ensure the cookie is accessible across paths
        // Other cookie options...
      }
  }));

app.use(cors());
app.use(bodyparser.json());

const PORT = 5000;

app.post('/hashPass', async (request, response) => {
  console.log("User Input received");
  const { pass } = request.body;
  console.log("Password:"+pass);

  var hash = await bcrypt.hash(pass, 10);

  console.log("Hashed password:"+hash);
  response.json({ data: hash});
});


app.get('/getBillID/:objectId/:adminCode', async (req, res) => {
  try {
    const objectId = req.params.objectId;
    const adminCode = req.params.adminCode;

    // Validate if the provided ID is a valid MongoDB Object ID
    if (!mongoose.Types.ObjectId.isValid(objectId)) {
      return res.status(400).json({ message: 'Invalid Object ID' });
    }

    // Find the bill by Object ID and adminCode
    const bill = await Bill.findOne({ _id: objectId, userAcc: adminCode });
    console.log(bill);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found for the provided Object ID and adminCode' });
    }

    res.json({ bill });
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/getBill/:objectId', async (req, res) => {
  try {
    const objectId = req.params.objectId;

    // Validate if the provided ID is a valid MongoDB Object ID
    if (!mongoose.Types.ObjectId.isValid(objectId)) {
      return res.status(400).json({ message: 'Invalid Object ID' });
    }

    // Find the bill by Object ID
    const bill = await Bill.findById(objectId);

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.json({ bill });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const updateCredit = async (userAccId) => {
  try {
    const userHistory = await UserHistory.findOne({ User_ACC_ID: userAccId });
    console.log(userHistory);
    if (!userHistory) {
      throw new Error('UserHistory not found');
    }

    const priorCredit = userHistory.Credit;

    userHistory.Credit =0;

    await userHistory.save();

    return priorCredit;
  } 
  catch (error) {
    throw error;
  }
};

// Your app.post route to update Credit and CollectedEarnings
app.post('/updateCreditAndCollectedEarnings', async (req, res) => {
  try {
    const { userAccId, regionCode, timePeriod} = req.body;
  //  console.log(userAccId);
    const incrementValue = await updateCredit(userAccId);
    await updateCollectedEarnings(regionCode, timePeriod, incrementValue);

    res.json({
      message: 'Credit and CollectedEarnings updated successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
const updateCollectedEarnings = async (regionCode, TimePeriod, incrementValue) => {
  try {
    const dateToUpdate = new Date(TimePeriod);
    dateToUpdate.setDate(1);

    const regionHist = await RegionHist.findOne({
      RegionCode: regionCode,
      TimePeriod: dateToUpdate,
    });

    if (!regionHist) {
      throw new Error('Record not found');
    }

    regionHist.CollectedEarnings += incrementValue;

    await regionHist.save();
    console.log('CollectedEarnings updated successfully');
  } catch (error) {
    console.error(error.message);
  }
};



app.post('/genericQuery', (request, response) => {
    console.log("Update Data received");
    const { params } = request.body;
    const { query } = request.body;
//    const {condition} = request.body;
    const db = dbService.getDbServiceInstance();    
    const result = db.genericQuery(query,params);
    result    
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});
app.post('/removeUserHist', async (req, res) => {
  try {
    const accountIdToRemove = req.body.AID; // Assuming x is passed in the request body

    // Check if accountIdToRemove is present in the request body
    if (!accountIdToRemove) {
      return res.status(400).json({ error: 'Account ID (x) is required in the request body.' });
    }
    // Use deleteMany to remove documents with the specified account ID
    const result = await UserHistory.deleteMany({ User_ACC_ID: accountIdToRemove });
    res.json({ message: `Deleted ${result.deletedCount} documents with User_ACC_ID ${accountIdToRemove}` });
  } catch (error) {
    console.error("Error while deleting documents:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/insertbill", async (req, res) => {
    try {
      const {
        issuedDate,
        dueDate,
        rcode,
        prevRead,
        presRead,
        userAcc,
        Fixed,
        Energy,
        FPPCA,
        Billing,
        Credit
        } = req.body;
      const x = Billing;
      console.log("Bill="+x);
      const newBill = new Bill({
        issuedDate: issuedDate,
        dueDate:dueDate,
        prevRead:prevRead,
        presRead:presRead,
        userAcc:userAcc,
        Fixed:Fixed,
        Energy:Energy,
        FPPCA:FPPCA,
        Bill:x,
        Credit:Credit,
        });
      savedBill = await newBill.save();
        console.log("Bill:"+savedBill);
      // Find or create UserHistory based on User_ACC_ID
      const userHistory = await UserHistory.findOne({ User_ACC_ID: userAcc });
  
      if (!userHistory) {
        console.log("Creating new history");
        const newUserHistory = new UserHistory({
          User_ACC_ID: userAcc,
          Credit: savedBill.Total,
          Latest_Bill_ID: newBill._id,
        });
  
        await newUserHistory.save();
      } 
      else {
        userHistory.Credit = savedBill.Total;
        userHistory.Latest_Bill_ID = newBill._id;
        await userHistory.save();
      }
      console.log("Bill and UserHistory updated succesfully");
      
      await updateOrCreateDocument(rcode,issuedDate, savedBill.Total , (presRead-prevRead));
      res.status(201).json({ message: "Bill inserted and UserHistory updated successfully. Region History also modified." });
    } 
    catch (error) {
      console.error("Error inserting bill and updating UserHistory:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

async function updateOrCreateDocument(regionCode, givenDate, x, y) {
    try {
      // Convert the given date to the first day of the month
      const dateToUpdate = new Date(givenDate);
      dateToUpdate.setDate(1);
  
      const result = await RegionHist.updateOne(
        {
          RegionCode: regionCode,
          TimePeriod: dateToUpdate
        },
        {
          $inc: {
            ProjectedEarnings: x,
            TotalUnitsConsumed: y
          }
        },
        { upsert: true } // Upsert option to create a new document if no match is found
      );
  
      if (result.nModified > 0) {
        console.log('Update successful:', result);
      } else {
        console.log('No matching record found for the given region code and date. Creating a new document.');
      }
    } catch (error) {
      console.error('Error updating/creating record:', error);
    }
  }

app.get('/getAggregateRegionHist', async (req, res) => {
    try {
        const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // Months are zero-based, so add 1 to get the correct month
  
      const result = await RegionHist.aggregate([
        {
          $match: {
            'TimePeriod': {
              $gte: new Date(year, month - 1, 1), // Start of the specified month
              $lt: new Date(year, month, 1)       // Start of the next month
            }
          }
        },
        {
          $group: {
            _id: null,
            totalProjectedEarnings: { $sum: '$ProjectedEarnings' },
            totalCollectedEarnings: { $sum: '$CollectedEarnings' },
            totalTotalUnitsConsumed: { $sum: '$TotalUnitsConsumed' }
          }
        }
      ]);
  
      if (result.length > 0) {
        res.json(result[0]); // Send the first (and only) element of the result array
      } else {
        res.json({ message: 'No matching documents found for the given region code and today\'s year and month.' });
      }
    } catch (error) {
      console.error('Error retrieving sum:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/getRegionHist/:regionCode', async (req, res) => {
    try {
      const regionCode = req.params.regionCode;
  
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // Months are zero-based, so add 1 to get the correct month
  
      const document = await RegionHist.findOne({
        RegionCode: regionCode,
        'TimePeriod': {
          $gte: new Date(year, month - 1, 1), // Start of the specified month
          $lt: new Date(year, month, 1)       // Start of the next month
        }
      });
  
      if (document) {
        res.json(document);
      } else {
        res.json({ message: 'No matching document found for the given region code and today\'s year and month.' });
      }
    } catch (error) {
      console.error('Error retrieving document:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.get("/getuserhistory/:userAccId", async (req, res) => {
    try {
      const userAccId = parseInt(req.params.userAccId);
  
      const userHistory = await UserHistory.findOne({ User_ACC_ID: userAccId }).populate("Latest_Bill_ID");
  
      if (userHistory) {
        console.log("Returning User History");
        res.status(200).json(userHistory);
        
      } else {
        res.status(404).json({ error: "UserHistory not found" });
      }
    } 
    catch (error) {
      console.error("Error retrieving UserHistory:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

app.post('/user/login',(req,res)=>{
    delete req.session.acc_id;
    const {ACCID} = req.body;
    console.log(ACCID);
//    req.session.user="Sup";
    req.session.acc_id=ACCID;
    console.log("Session: "+req.sessionID);
    res.status(200).json({ redirect: '../../User/Profile Page/index.html' });
    res.send("hello");
})

app.get("/user/test",(req,res)=>{
    console.log(req.session.user);
    console.log(req.session.acc_id);
    res.send("hurray");
});
app.get("/user/logout",(req,res)=>{
    delete req.session.user;
    delete req.session.acc_id;
//    console.log(req.session.user);
    res.send("hurray");
});
// app.get('/admin/login',(req,res)=>{
//     req.session.user="black clover";
//     res.send("hello");
// })
// app.get("/admin/test",(req,res)=>{
//     console.log(req.session.user);
//     res.send("hurray");
// });
// app.get("/admin/logout",(req,res)=>{
//     delete req.session.user;
//     console.log(req.session.user);
//     res.send("hurray");
// });


app.get('/getAll', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllData();
    
    result.then(console.log(result))
    .then(data => response.json({data : data}))    
    .catch(err => console.log(err));
});

app.get('/getBlankRegions', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getBlankRegions();
    
    result.then(console.log(result))
    .then(data => response.json({data : data}))    
    .catch(err => console.log(err));
});

app.post('/user/getUserDetails', (request, response) => {
    let {ACCID} = request.body;
    const db = dbService.getDbServiceInstance();
    
    const result = db.getUserDetails(ACCID);
    
    result.then(console.log(result))
    .then(data => response.json({data : data}))    
    .catch(err => console.log(err));
});

app.get('/getAdminIDS', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getAdminIDs();    
    result.then(console.log(result))
    .then(data => response.json({data : data}))    
    .catch(err => console.log(err));
});

app.get('/getTariffs', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getTariffs();
    
    result.then(console.log(result))
    .then(data => response.json({data : data}))    
    .catch(err => console.log(err));
});

app.get('/getSchemes', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getSchemes();
    
    result.then(console.log(result))
    .then(data => response.json({data : data}))    
    .catch(err => console.log(err));
});

app.get('/getRegionDetails', (request, response) => {   //get all region details
    const db = dbService.getDbServiceInstance();

    const result = db.getRegionDetails();
    
    result.then(console.log(result))
    .then(data => response.json({data : data}))    
    .catch(err => console.log(err));
});

app.get('/getRegionNames', (request, response) => {   //get all region details
    const db = dbService.getDbServiceInstance();

    const result = db.getRegionNames();
    
    result.then(console.log(result))
    .then(data => response.json({data : data}))    
    .catch(err => console.log(err));
});

app.get('/getSuperadminDetails', (request, response) => {   //get all region details
    const db = dbService.getDbServiceInstance();

    const result = db.getSuperadminDetails();
    
    result.then(console.log(result))
    .then(data => response.json({data : data}))    
    .catch(err => console.log(err));
});


app.get('/getUserNameFromLogin', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getUserName_LoginData();
    
    result.then(console.log(result))
    .then(data => response.json({data : data}))    
    .catch(err => console.log(err));
});


app.post('/checkInUser', async (request, response) => {
    console.log("User Input received");
 //   const { name } = request.body;
    const { pass } = request.body;
    const {ACCID} = request.body;
    const db = dbService.getDbServiceInstance();
    
    const result = await db.isUserPresent(pass,ACCID);
    console.log(result);

    try{
    console.log("From experiment: "+result[0]['Password']);
 //   request.session.user = ACCID;
    var truth = await findtruth(result[0]['Password'], pass);
    console.log(truth);
    response.json({ data: truth});
    }
    catch{
      response.json({data:false});
    }

  });
async function findtruth(hashedPassword, plainPassword){
  console.log("In Find truth: "+hashedPassword);
  console.log("In Find truth: "+plainPassword);

  const truth = bcrypt.compare(plainPassword, hashedPassword);
  console.log("Truth value= "+truth);
  return truth;
}


app.post('/checkInAdmin', (request, response) => {
    console.log("User Input received");
 //   const { name } = request.body;
    const { pass } = request.body;
    const {ACCID} = request.body;
    const db = dbService.getDbServiceInstance();
    
    const result = db.isAdminPresent(pass,ACCID);
    console.log("From experiment: "+result['truth']);
 //   request.session.user = ACCID;
    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});
app.post('/checkInSuperAdmin', (request, response) => {
    console.log("User Input received");
 //   const { name } = request.body;
    const { pass } = request.body;
    const {ACCID} = request.body;
    const db = dbService.getDbServiceInstance();
    
    const result = db.isSuperAdminPresent(pass,ACCID);
    console.log("From experiment: "+result['truth']);
 //   request.session.user = ACCID;
    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});


app.post('/getTariffDetails', (request, response) => {
    console.log("User Input received");
    const { TID } = request.body;
    const db = dbService.getDbServiceInstance();
    
    const result = db.getTariff(TID);
//    const slabs = db.getTariffSlab(TID);
    console.log("From experiment: "+result);

    result    
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});

app.post('/getSchemeDetails', (request, response) => {
    console.log("User Input received");
    const { SID } = request.body;
    const db = dbService.getDbServiceInstance();
    
    const result = db.getScheme(SID);

    result    
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});

app.post('/getRegionAdminDetails', (request, response) => {
    console.log("User Input received");
    const { RNAME } = request.body;
    const db = dbService.getDbServiceInstance();
    
    const result = db.getRegionAdminDetails(RNAME);

    result    
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});


app.post('/getAdminProfile', (request, response) => {
    console.log("Admin Input received");
    const { AID } = request.body;

    const db = dbService.getDbServiceInstance();    
    const result = db.getAdminProfile(AID);

    result    
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});

app.post('/updateData', (request, response) => {
    console.log("Update Data received");
    const { param } = request.body;
    const { query } = request.body;
    const {condition} = request.body;

    const db = dbService.getDbServiceInstance();    
    const result = db.updateData(param,query,condition);
    result    
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});
app.post('/insertScheme', (request, response) => {
    console.log("User Data received");
    const { SID } = request.body;
    const { percent_inc } = request.body;
    const { max_en } = request.body;

    const db = dbService.getDbServiceInstance();    
    const result = db.insertScheme(SID,percent_inc,max_en);
    result    
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});
app.post('/insertAdmin', (request, response) => {
    console.log("User Data received");
    const { AID } = request.body;
    const { name } = request.body;
    const { phone } = request.body;
    const { rcode } = request.body;
    const { password } = request.body;
    console.log(rcode);

    const db = dbService.getDbServiceInstance();    
    const result = db.insertAdmin(AID,name,phone,rcode,password);

    result    
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});
app.post('/insertUser', (request, response) => {
    console.log("User Data received");
    const { aadhar } = request.body;
    const { name } = request.body;
    const { phone } = request.body;
    const { rcode } = request.body;
    const { TID } = request.body;
    const { addr } = request.body;
    const {SID} = request.body;
    console.log(rcode);

    const db = dbService.getDbServiceInstance();    
    const result = db.insertUser(aadhar,name,addr,rcode,phone,TID,SID);

    result    
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});

app.post('/deleteAdminId', (request, response) => {
    console.log("User Data received");
    const { AID } = request.body;

    const db = dbService.getDbServiceInstance();    
    const result = db.deleteAdminId(AID);

    result    
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});
app.post('/deleteSchemeId', (request, response) => {
    console.log("Scheme ID received for deletion");
    const { SID } = request.body;

    const db = dbService.getDbServiceInstance();    
    const result = db.deleteSchemeId(SID);

    result    
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});



app.listen(PORT, () => console.log(`Hello World ${PORT}`));