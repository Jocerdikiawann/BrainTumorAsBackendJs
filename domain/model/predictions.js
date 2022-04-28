module.exports = (db) => {
    var predictions = new db.Schema({
        non_tumor_scores: {
            type: String,
            required: true
        },
        tumor_scores: {
            type: String,
            required: true,
        }
    }, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    })
    return db.model('predictions', predictions)
}