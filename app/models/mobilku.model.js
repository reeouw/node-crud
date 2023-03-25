const sql = require("./db.js");

exports.mobilkuCreate = (user, response) => {
    let query = "INSERT INTO mobilku SET ?"; 
    sql.query(query, user, (err, res) => {
        if (err) {
            console.log("error: ", err);
            response(err, null);
        }
        
        console.log('User created: ', { id: res.insertId, ...user });
        response(null, { id: res.insertId, ...user });
    });
};

exports.mobilkuImageCreate = (userImage, response) => {
    let query = "INSERT INTO mobilku_images SET ?"; 
    sql.query(query, userImage, (err, res) => {
        if (err) {
            console.log("error: ", err);
            response(err, null);
        }

        console.log('User image created: ', { id: res.insertId, ...userImage });
        response(null, { id: res.insertId, ...userImage });
    })
};
