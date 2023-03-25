const sql = require("./db.js");

// constructor
const Vehicle = function(vehicle) {
    this.name = vehicle.name;
};

Vehicle.findAll = (name, result) => {

    let query = "SELECT * FROM vehicles";

    if (name) {
        query += ` WHERE name LIKE ?`;
    }

    sql.query(query, ['%' + name + '%'], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);
    });
};

Vehicle.create = (newVehicle, result) => {
    sql.query("INSERT INTO vehicles SET ?", newVehicle, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created vehicle: ", { id: res.insertId, ...newVehicle });
        result(null, { id: res.insertId, ...newVehicle });
    });
};

Vehicle.findById = (id, result) => {
    
    let query = "SELECT * FROM vehicles WHERE id = ? ";

    sql.query(query, [id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found tutorial: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found vehicle with the id
        result({ kind: "not_found" }, null);
    });
};

Vehicle.updateById = (id, vehicle, result) => {
    sql.query(
        "UPDATE vehicles SET name = ? WHERE id = ?",
        [vehicle.name, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found vehicle with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated vehicle: ", { id: id, ...vehicle });
            result(null, { id: id, ...vehicle });
        }
    );
};

module.exports = Vehicle;
