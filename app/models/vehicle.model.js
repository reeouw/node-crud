const sql = require("./db.js");

// constructor
const Vehicle = function(vehicle) {
    this.id = vehicle.id;
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

Vehicle.upload = (vehicleImage, result) => {
    sql.query("INSERT INTO vehicle_images (vehicle_id, path, size) VALUES (?, ?, ?)",
        [
            vehicleImage.vehicle_id,
            vehicleImage.path,
            vehicleImage.size,
        ], 
        (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
    })
}

Vehicle.findById = (id, result) => {
    
    let query = "SELECT vehicles.id, vehicles.name, vehicle_images.path, vehicle_images.size FROM vehicles JOIN vehicle_images ON vehicles.id = vehicle_images.vehicle_id WHERE vehicles.id = ? AND vehicle_images.size = ? ";

    sql.query(query, [id, '500'], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found vehicle: ", res[0]);
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
