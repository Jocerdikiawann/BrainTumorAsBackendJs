const { db } = require('../db')

exports.GetAllPredictions = async () => {
    return await db.db.models.Tumor.find()
}

exports.GetDetailPredictionById = async (id) => {
    return await db.db.models.Tumor.findOne({ _id: id })
}

exports.CreatePredictions = async (data) => {
    return await db.db.models.Tumor.create(data)
}

exports.UpdatePredictions = async (oldData, newData) => {
    return await db.db.models.Tumor.updateOne(oldData, newData)
}

exports.DeletePredictions = async (data) => {
    return await db.db.models.Tumor.deleteOne(data)
}