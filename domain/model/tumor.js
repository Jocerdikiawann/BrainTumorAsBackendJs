module.exports = (db) => {
    var tumor = new db.Schema({
        image: {
            type: String,
            required: true
        },
        prediction: {
            type: [{ "non_tumor": String, "tumor": String }],
            required: true
        }
    })
    return db.model('tumor', tumor)
}