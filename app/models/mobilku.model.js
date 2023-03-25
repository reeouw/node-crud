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

exports.mobilkuImageCreate = (path, response) => {
    let query = "INSERT INTO mobilku_images SET ?"; 
    sql.query(query, path, (err, res) => {
        if (err) {
            console.log("error: ", err);
            response(err, null);
        }

        console.log('User image created: ', { id: res.insertId, ...path });
        response(null, { id: res.insertId, ...path });
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

exports.mobilkuUpdate = (updateUser, userId, response) => {
    let query = "UPDATE mobilku SET ? WHERE id = ?"; 
    sql.query(query, [updateUser, userId], (err, res) => {
        if (err) {
            console.log("error: ", err);
            response(err, null);
        }
        
        console.log('User created: ', { id: res.insertId, ...updateUser });
        response(null, { id: res.insertId, ...updateUser });
    });
};

exports.mobilkuImageUpdate = (newPath, userId, size, response) => {
    let query = "UPDATE mobilku_images SET path = ?, size = ? WHERE mobilku_id = ? AND size = ?"; 
    sql.query(query, [newPath, size, userId, size], (err, res) => {
        if (err) {
            console.log("error: ", err);
            response(err, null);
        }

        console.log('User image updated : ', { id: res.insertId });
        response(null, { id: res.insertId });
    })
};