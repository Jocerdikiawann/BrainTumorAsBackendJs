const { consolog } = require('../../utils')
const { db } = require('../db')

exports.GetAllPredictions = async () => {
    const data = await db.db.models.Tumor.find().populate({ path: "predictionId", select: "id non_tumor_scores tumor_scores" })
    return data
}

exports.GetDetailPredictionById = async (id) => {
    const tumor = await db.db.models.Tumor.findOne({ _id: id }).populate({ path: "predictionId", select: "id non_tumor_scores tumor_scores" })
    return tumor
}

exports.CreatePredictions = async (payload) => {
    const predictions = await db.db.models.Predictions.create(payload.prediction)


    const tumor_data = await db.db.models.Tumor.create({
        name: payload.name,
        image: payload.image,
        predictionId: predictions._id
    })

    const get_data_tumor = await db.db.models.Tumor.findOne({ _id: tumor_data._id }).populate({ path: "predictionId", select: "id non_tumor_scores tumor_scores" })

    return get_data_tumor
}

// exports.UpdatePredictions = async (oldData, newData) => {
//     return await db.db.models.Tumor.updateOne(oldData, newData)
// }

// exports.DeletePredictions = async (data) => {
//     return await db.db.models.Tumor.deleteOne(data)
// }