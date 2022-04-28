module.exports = (db) => {
    var tumor = new db.Schema({
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        predictionId: {
            type: db.Schema.Types.ObjectId,
            ref: "predictions",
            required: true
        }
    }, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    })
    return db.model('tumor', tumor)
}