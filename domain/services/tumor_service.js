const isImage = require('is-base64')
const base64 = require('base64-img')
const { ResponseApi, enum_, consolog, utils } = require('../../utils')
const { tumor_repo } = require('../repository')
const tf = require('@tensorflow/tfjs')
const tfn = require('@tensorflow/tfjs-node')
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
    try {

        const image_origin = request.body.image
        const INPUT_SIZE = 64
        const NUM_OF_CHANNELS = 3;

        let labels = ["non_tumor", "tumor"]
        let result_array = []

        if (!isImage(image_origin, { mimeRequired: true })) {
            return await ResponseApi(enum_.CODE_BAD_REQUEST, "error", "invalid base64", {})
        }

        const handler = tfn.io.fileSystem(model_json)
        const model = await tfn.loadLayersModel(handler)
        model.summary()

        var filepath = base64.imgSync(image_origin, "./public/images", Date.now());

        const jimp_src = await Jimp.read(`./${filepath}`)
        jimp_src.cover(INPUT_SIZE, INPUT_SIZE, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)

        let values = new Float32Array(INPUT_SIZE * INPUT_SIZE * NUM_OF_CHANNELS);

        let i = 0
        jimp_src.scan(0, 0, jimp_src.bitmap.width, jimp_src.bitmap.height, (x, y, idx) => {
            const pixel = Jimp.intToRGBA(jimp_src.getPixelColor(x, y))
            pixel.r = pixel.r / 127.0 - 1;
            pixel.g = pixel.g / 127.0 - 1;
            pixel.b = pixel.b / 127.0 - 1;
            pixel.a = pixel.a / 127.0 - 1;
            values[i * NUM_OF_CHANNELS + 0] = pixel.r;
            values[i * NUM_OF_CHANNELS + 1] = pixel.g;
            values[i * NUM_OF_CHANNELS + 2] = pixel.b;
            i++;
        })

        const outShape = [64, 64, NUM_OF_CHANNELS];

        let image_tensor = tfn.tensor3d(values, outShape, 'float32')
        image_tensor = image_tensor.expandDims(0)

        const prediction = await model.predict(image_tensor).dataSync()

        for (let i = 0; i < prediction.length; i++) {
            const label = labels[i];
            const probability = `${parseInt(prediction[i] * 100)}%`;
            const data = {}
            data[label] = probability
            result_array.push(data)
        }

        // base64.img(image_origin, "./public/images", Date.now(), async (err, filepath) => {
        //     if (err) {
        //         return await ResponseApi(enum_.CODE_BAD_REQUEST, "error", err.message, {})
        //     }


        // })

        return await ResponseApi(enum_.CODE_CREATED, "success", "data has been created", { prediction: result_array })
    } catch (error) {
        return await ResponseApi(enum_.CODE_BAD_REQUEST, "error", error.message, {})
    }
}