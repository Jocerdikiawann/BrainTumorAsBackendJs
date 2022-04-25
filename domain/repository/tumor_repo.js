const database = require('../db')

exports.GetAllPredictions = async () => {
    return await database.db.models.Tumor.find()
}

exports.GetDetailPredictionById = async (id) => {
    return await database.db.models.Tumor.findOne({ _id: id })
}

exports.CreatePredictions = async (data) => {
    return await database.db.models.Tumor.create(data)
}

exports.UpdatePredictions = async (oldData, newData) => {
    return await database.db.models.Tumor.updateOne(oldData, newData)
}

exports.DeletePredictions = async (data) => {
    return await database.db.models.Tumor.deleteOne(data)
}