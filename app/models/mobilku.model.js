const { response } = require("express");
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

exports.mobilkuShow = (id, response) => {
    let query = "SELECT mobilku.*, mobilku_images.id AS image_id, mobilku.name, mobilku_images.path, mobilku_images.size FROM mobilku JOIN mobilku_images ON mobilku.id = mobilku_images.mobilku_id WHERE mobilku.id = ?";

    sql.query(query, [id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            response(err, null);
            return;
        }

        if (res.length) {
            console.log("found user: ", res[0]);
            response(null, res);
            return;
        }

        // Not found user with the id
        response({ kind: "not_found" }, null);
    });
}
