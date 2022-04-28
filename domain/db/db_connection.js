const mongoose = require('mongoose')
const { tumor, predictions } = require('../model')
const { config_db, consolog } = require('../../utils')

let db = {}

if (config_db.db.mongodb && Object.keys(config_db.db.mongodb).length > 0) {
    const host = config_db.db.mongodb.host
    const port = config_db.db.mongodb.port
    const database = config_db.db.mongodb.database
    const connection_name = config_db.db.mongodb.nameconnection

    consolog.LogInfo(host, port)

    mongoose.connect(`mongodb://${host}:${port}/${database}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    db[connection_name] = {}
    db[connection_name].conn = mongoose
    db[connection_name].Tumor = tumor(mongoose)
    db[connection_name].Predictions = predictions(mongoose)

    exports.db = db
} else {
    consolog.LogDanger("Tidak ada database")
}