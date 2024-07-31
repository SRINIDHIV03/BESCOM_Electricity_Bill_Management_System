const mysql = require('mysql2');
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root@1234",
  database:"bescom",
  port:3306,
  connectTimeout:60000
});

let instance = null;
class DbService {
  static getDbServiceInstance() {
      return instance ? instance : new DbService();
  }
  
  async getAllData() {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM Admin_Login;";

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

  async isUserPresent(name, pass) {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "SELECT EXISTS(SELECT * FROM Admin_Login WHERE Admin_Id=? AND Password=?) AS truth;";

            con.query(query, [name,pass], (err, results) => {
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

}
module.exports = DbService;