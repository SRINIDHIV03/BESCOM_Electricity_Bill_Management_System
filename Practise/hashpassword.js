const bcrypt = require('bcrypt');

const plainPassword = '12345';

// Generating a salt
async function func(){
const saltRounds = 10;
const salt = await bcrypt.genSalt(saltRounds, function(err, salt) {
    if (err) {
        console.error('Error generating salt:', err);
        return;
    }

    // Hashing the password with the generated salt
    bcrypt.hash(plainPassword, salt, function(err, hash) {      //can give a fixed number instead of salt 
        if (err) {
            console.error('Error hashing password:', err);
            return;
        }

        // Now you can store the hashed password in your database
        console.log('Hashed password:', hash);
        console.log('Salt: '+salt);
        // Later, when verifying the password
        const inputPassword = '12345';
        bcrypt.compare(inputPassword, hash, function(err, result) {
            if (err) {
                console.error('Error comparing passwords:', err);
                return;
            }

            if (result) {
                console.log('Password matched!');
            } else {
                console.log('Password does not match!');
            }
        });
    });
});
}

func();