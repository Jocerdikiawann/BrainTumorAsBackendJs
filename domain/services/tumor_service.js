const isImage = require('is-base64')
const base64 = require('base64-img')
const { ResponseApi, enum_, consolog } = require('../../utils')
const { tumor_repo } = require('../repository')
const tf = require('@tensorflow/tfjs')
const tfn = require('@tensorflow/tfjs-node')
const cv = require('opencv4nodejs')
const fs = require('fs')
const Jimp = require('jimp')
const model_json = "./tfjs_model/model.json"

exports.GetAllPredictions = async (request) => {
    try {
        const tumor_media = await tumor_repo.GetAllPredictions()
        const mapped_tumor_media = tumor_media.map((m) => {
            m.image = `${request.get('host')}/${m.image}`
            return m
        })
        return await ResponseApi(enum_.CODE_OK, "success", "data prediction has been sent", mapped_tumor_media)
    } catch (error) {
        return await ResponseApi(enum_.CODE_BAD_REQUEST, "error", error.message, {})
    }
}

exports.GetDetailPredictions = async (request) => {
    try {
        const { id } = request.params
        const tumor = await tumor_repo.GetDetailPredictionById(id)

        if (!tumor) {
            return await ResponseApi(enum_.CODE_NOT_FOUND, "error", "id not found", {})
        }

        const image = `${request.get('host')}/${tumor.image}`
        const data = {
            id: id,
            image: image,
            prediction: tumor.prediction,
            createdAt: tumor.createdAt,
            updatedAt: tumor.updatedAt
        }
        return await ResponseApi(enum_.CODE_OK, "success", "data has been sent", data)
    } catch (error) {
        return await ResponseApi(enum_.CODE_BAD_REQUEST, "error", error.message, {})
    }
}

exports.CreatePredictions = async (request) => {
    const image_origin = request.body.image
    const INPUT_SIZE = 64
    if (!isImage(image_origin, { mimeRequired: true })) {
        return await ResponseApi(enum_.CODE_BAD_REQUEST, "error", "invalid base64", {})
    }

    try {
        const handler = tfn.io.fileSystem(model_json)
        const model = await tf.loadLayersModel(handler)

        base64.img(image_origin, "./public/images", Date.now(), async (err, filepath) => {
            if (err) {
                return await ResponseApi(enum_.CODE_BAD_REQUEST, "error", err.message, {})
            }

            const img_cv = cv.imread("./public/images/1650847594357.jpg")
            const resize = img_cv.resize(64, 64)

            const inputBlob = resize.getDataAsArray()

            // const tensor = tf.tensor(inputBlob, [resize.rows, resize.cols, 3]).expandDims(0)

            // const result = model.predict(tensor)


            consolog.LogDanger(inputBlob)


            return await ResponseApi(enum_.CODE_CREATED, "success", "data has been created", { tes: "e" })
        })
    } catch (error) {
        consolog.LogDanger(error)
    }
}