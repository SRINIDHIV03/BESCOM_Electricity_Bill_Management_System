const mysql = require('mysql2');
//const express = require('express');
//const app = express();

//app.use(express.json());
//app.use(express.urlencoded({ extended : false }));


const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root@1234",
  database:"elec_bill",
  port:3306,
  multipleStatements:true,
  connectTimeout:60000
});
//module.exports = con;
/*
app.post('/login/:user&:pass', (request,response)=>{
/*  response.writeHead(200, {'Content-Type': 'text/html'});
  var q = url.parse(request.url, true).query;
  var txt = q.user + " " + q.pass;
  res.end(txt);
  console.log(txt);
  const { name } = request.params;
  console.log(name);

});
*/

let instance = null;
class DbService {
  static getDbServiceInstance() {
      return instance ? instance : new DbService();
  }

  async genericQuery(query,params) {  //all queries of form UPDATE [Table_name] SET [col_name]=param WHERE condition;
    try {
        const res1 = await new Promise((resolve, reject) => {
//            const query = "INSERT INTO SCHEME VALUES(?,?,?);";   
            con.query(query, params, (err, results) => {
                if (err) reject(new Error(err.message));
                console.log(results);
                resolve(results);
            })
        });
        console.log(res1);
        return res1;
    } 
    catch (error) {
        console.log(error);
    }
  }

  
  async getAllData() {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM User_Logins;";

            con.query(query, (err, results) => {
                if (err) reject(new Error(err.message));
                //console.log(results);
                resolve(results);
            })
        });
        // console.log(response);
        return response;
    } 
    catch (error) {
        console.log(error);
    }
  }
  
  async getBlankRegions() {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "SELECT R.REGION_CODE FROM REGION R WHERE R.REGION_CODE NOT IN (SELECT A.REGION_CODE FROM ADMINISTRATOR A, ADMIN_LOGINS AL WHERE AL.Username=A.ADMIN_ID);";

            con.query(query,  (err, results) => {
                if (err) reject(new Error(err.message));
                console.log(results);
                resolve(results);
            })
        });
        // console.log(response);
        return response;
    } 
    catch (error) {
        console.log(error);
    }
  }


  async isUserPresent(pass, acc_id) {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "SELECT Password FROM User_Logins WHERE ACC_ID=?;";  //"SELECT EXISTS(SELECT * FROM User_Logins WHERE Password=? AND ACC_ID=?) AS truth;";

            con.query(query, [acc_id], (err, results) => {
                if (err) reject(new Error(err.message));
                console.log(results);
                resolve(results);
            })
        });
        // console.log(response);
        return response;
    } 
    catch (error) {
        console.log(error);
    }
  }
  async isAdminPresent(pass, acc_id) {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "SELECT EXISTS(SELECT * FROM Admin_Logins WHERE Password=? AND Username=?) AS truth;";

            con.query(query, [pass,acc_id], (err, results) => {
                if (err) reject(new Error(err.message));
                console.log(results);
                resolve(results);
            })
        });
        // console.log(response);
        return response;
    } 
    catch (error) {
        console.log(error);
    }
  }
  async isSuperAdminPresent(pass, acc_id) {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "SELECT EXISTS(SELECT * FROM Superadmin_Logins WHERE Password=? AND Username=?) AS truth;";

            con.query(query, [pass,acc_id], (err, results) => {
                if (err) reject(new Error(err.message));
                console.log(results);
                resolve(results);
            })
        });
        // console.log(response);
        return response;
    } 
    catch (error) {
        console.log(error);
    }
  }


  async getUserDetails(acc_id) {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "SELECT U.*,SU.SCHEME_ID FROM (User U LEFT OUTER JOIN SCHEME_USER SU ON SU.ACC_ID=U.ACC_ID) WHERE U.ACC_ID=?;";

            con.query(query, [acc_id], (err, results) => {
                if (err) reject(new Error(err.message));
                console.log(results);
                resolve(results);
            })
        });
        // console.log(response);
        return response;
    } 
    catch (error) {
        console.log(error);
    }
  }

  async getTariff(T_ID) {
    try {
        const tariff = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM Tariff WHERE Tariff_id=?;";

            con.query(query, [T_ID], (err, results) => {
                if (err) reject(new Error(err.message));
                console.log(results);
                resolve(results);
            })
        });
        const slabs = await new Promise((resolve, reject) => {
          const query = "SELECT low,up,charge AS slabs FROM tariff_slab WHERE tariff_id=? ORDER BY slab_id;";

          con.query(query, [T_ID], (err, results) => {
              if (err) reject(new Error(err.message));
              console.log(results);
              resolve(results);
          })
        });
        // console.log(tariff);
        // console.log(slabs);
        // console.log(response);
        //        await new Promise(resolve => setTimeout(resolve, 1000));

        var res = tariff[0];
        res['slabs'] = slabs;

        console.log(res);
        return res;
    } 
    catch (error) {
        console.log(error);
    }
  }

  async getScheme(S_ID) {
    try {
        const res = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM Scheme WHERE Scheme_id=?;";

            con.query(query, [S_ID], (err, results) => {
                if (err) reject(new Error(err.message));
                console.log(results);
                resolve(results);
            })
        });
        console.log(res);
        return res;
    } 
    catch (error) {
        console.log(error);
    }
  }

  async getRegionAdminDetails(R_NAME) {
    try {
        const res = await new Promise((resolve, reject) => {
            const query = "SELECT NAME,PHONE,OFFICE_LOC FROM administrator AS A, region AS R WHERE R.region_name=? AND R.REGION_CODE=A.REGION_CODE;";

            con.query(query, [R_NAME], (err, results) => {
                if (err) reject(new Error(err.message));
                console.log(results);
                resolve(results);
            })
        });
        console.log(res);
        return res;
    } 
    catch (error) {
        console.log(error);
    }
  }

  async getAdminProfile(A_ID) {
    try {
        const res = await new Promise((resolve, reject) => {
            const query = "SELECT ADMIN_ID,NAME,PHONE,OFFICE_LOC,REGION_NAME,R.REGION_CODE FROM administrator AS A, region AS R WHERE R.REGION_CODE=A.REGION_CODE AND A.ADMIN_ID=?;";

            con.query(query, [A_ID], (err, results) => {
                if (err) reject(new Error(err.message));
                console.log(results);
                resolve(results);
            })
        });
        console.log(res);
        return res;
    } 
    catch (error) {
        console.log(error);
    }
  }


  async getTariffs() {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "SELECT Tariff_id FROM Tariff;";

            con.query(query, (err, results) => {
                if (err) reject(new Error(err.message));
                //console.log(results);
                resolve(results);
            })
        });
        // console.log(response);
        return response;
    } 
    catch (error) {
        console.log(error);
    }
  }

  async getSchemes() {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "SELECT SCHEME_ID FROM SCHEME;";

            con.query(query, (err, results) => {
                if (err) reject(new Error(err.message));
                //console.log(results);
                resolve(results);
            })
        });
        // console.log(response);
        return response;
    } 
    catch (error) {
        console.log(error);
    }
  }
  async getRegionDetails() {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM region;";

            con.query(query, (err, results) => {
                if (err) reject(new Error(err.message));
                //console.log(results);
                resolve(results);
            })
        });
        // console.log(response);
        return response;
    } 
    catch (error) {
        console.log(error);
    }
  }
  async getAdminIDs() {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "SELECT Username FROM ADMIN_LOGINS;";

            con.query(query, (err, results) => {
                if (err) reject(new Error(err.message));
                //console.log(results);
                resolve(results);
            })
        });
         console.log(response);
        return response;
    }     catch (error) {
        console.log(error);}  }

  async getRegionNames() {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "SELECT REGION_NAME FROM region;";

            con.query(query, (err, results) => {
                if (err) reject(new Error(err.message));
                //console.log(results);
                resolve(results);
            })
        });
        // console.log(response);
        return response;
    } 
    catch (error) {
        console.log(error);
    }
  }
  async getSuperadminDetails() {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "SELECT NAME,PHONE,OFFICE_LOC FROM superadmin_logins as S, administrator AS A, region as R WHERE S.Username=A.ADMIN_ID AND A.REGION_CODE=R.REGION_CODE;";

            con.query(query, (err, results) => {
                if (err) reject(new Error(err.message));
                //console.log(results);
                resolve(results);
            })
        });
        // console.log(response);
        return response;
    } 
    catch (error) {
        console.log(error);
    }
  }


  async getUserName_LoginData() {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "SELECT Username FROM User_Logins;";

            con.query(query, (err, results) => {
                if (err) reject(new Error(err.message));
                //console.log(results);
                resolve(results);
            })
        });
        // console.log(response);
        return response;
    } 
    catch (error) {
        console.log(error);
    }
  }
  async insertScheme(SID,percent_inc,max_en) {
    try {
        const res1 = await new Promise((resolve, reject) => {
            
            const query = "INSERT INTO SCHEME VALUES(?,?,?);";   
            con.query(query, [SID,percent_inc,max_en], (err, results) => {
                if (err) reject(new Error(err.message));
                console.log(results);
                resolve(results);
            })
        });
        console.log(res1);
        return res1;
    } 
    catch (error) {
        console.log(error);
    }
  }
  async updateData(param,query,condition) {  //all queries of form UPDATE [Table_name] SET [col_name]=param WHERE condition;
    try {
        const res1 = await new Promise((resolve, reject) => {
//            const query = "INSERT INTO SCHEME VALUES(?,?,?);";   
            con.query(query, [param,condition], (err, results) => {
                if (err) reject(new Error(err.message));
                console.log(results);
                resolve(results);
            })
        });
        console.log(res1);
        return res1;
    } 
    catch (error) {
        console.log(error);
    }
  }

  async insertAdmin(AID,name,phone,rcode,password) {
    try {
        const res1 = await new Promise((resolve, reject) => {
            
            const query = "INSERT INTO ADMINISTRATOR(ADMIN_ID,NAME,PHONE,REGION_CODE) VALUES (?,?,?,?);";   
            con.query(query, [AID,name,phone,rcode], (err, results) => {
                if (err) reject(new Error(err.message));
                console.log(results);
                resolve(results);
            })
        });
        console.log(res1);
        const res2 = await new Promise((resolve, reject) => { 
            const query = "INSERT INTO Admin_LOGINS VALUES(?,?);";
            con.query(query, [AID,password], (err, results) => {
                if (err) reject(new Error(err.message));
                console.log(results);
                resolve(results);
            })
        });
        console.log(res2);
        const res = {...res1,...res2};
        return res;
    } 
    catch (error) {
        console.log(error);
    }
  }

  async insertUser(aadhar,name,addr,rcode,phone,TID,SID) {
    try {
        const res1 = await new Promise((resolve, reject) => {
            
            const query = "INSERT INTO USER(AADHAR,NAME,ADDRESS,REGION_CODE,PHONE,TARIFF_ID) VALUES (?,?,?,?,?,?);";
            
            con.query(query, [aadhar,name,addr,rcode,phone,TID], (err, results) => {
                if (err) reject(new Error(err.message));
                console.log(results);
                resolve(results);
            })
        });
        console.log(res1);
        const res2 = await new Promise((resolve, reject) => {
            
            const query = "INSERT INTO User_LOGINS(ACC_ID,Username) SELECT ACC_ID,NAME FROM USER WHERE ACC_ID=(SELECT ACC_ID FROM USER WHERE AADHAR=?) AND NAME=?;";
            
            con.query(query, [aadhar,name], (err, results) => {
                if (err) reject(new Error(err.message));
                console.log(results);
                resolve(results);
            })
        });
        console.log(res2);
        const res3 = await new Promise((resolve, reject) => {
            
            const query = "INSERT INTO SCHEME_USER(ACC_ID,SCHEME_ID,IS_ELIGIBLE,ELIG_LIMIT) VALUES ((SELECT ACC_ID FROM USER WHERE Aadhar=?),?,TRUE,0);";
            
            con.query(query, [aadhar,SID], (err, results) => {
                if (err) reject(new Error(err.message));
                console.log(results);
                resolve(results);
            })
        });
        console.log(res3);
        const res = { ...res1, ...res2, ...res3 };
        return res;
    } 
    catch (error) {
        console.log(error);
    }
  }

  async deleteAdminId(AID) {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "DELETE FROM ADMINISTRATOR WHERE ADMIN_ID=?;";

            con.query(query,[AID], (err, results) => {
                if (err) reject(new Error(err.message));
                //console.log(results);
                resolve(results);
            })
        });
        // console.log(response);
        return response;
    } 
    catch (error) {
        console.log(error);
    }
  }
  async deleteSchemeId(SID) {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "DELETE FROM SCHEME WHERE SCHEME_ID=?;";

            con.query(query,[SID], (err, results) => {
                if (err) reject(new Error(err.message));
                //console.log(results);
                resolve(results);
            })
        });
        // console.log(response);
        return response;
    } 
    catch (error) {
        console.log(error);
    }
  }

}
module.exports = DbService;
