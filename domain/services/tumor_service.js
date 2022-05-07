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
            m.image = `${request.get('host')}/images/${m.image}`
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

        tumor.image = `${request.get('host')}/${tumor.image}`

        return await ResponseApi(enum_.CODE_OK, "success", "data has been sent", tumor)
    } catch (error) {
        return await ResponseApi(enum_.CODE_BAD_REQUEST, "error", error.message, {})
    }
}

exports.CreatePredictions = async (request) => {
    try {

        const image_origin = request.body.image
        const name = request.body.name

        const INPUT_SIZE = 64
        const NUM_OF_CHANNELS = 3;

        let labels = ["tumor_scores", "non_tumor_scores"]
        let result_data = {}

        if (!isImage(image_origin, { mimeRequired: true })) {
            return await ResponseApi(enum_.CODE_BAD_REQUEST, "error", "invalid base64", {})
        }

        const handler = tfn.io.fileSystem(model_json)
        const model = await tfn.loadLayersModel(handler)
        model.summary()

        const filepath = base64.imgSync(image_origin, "./public/images", Date.now());

        const filename = filepath.split("/").pop()

        // const upload_image = await is3_repo.UploadImage(filename, filepath)
        // consolog.LogDanger(upload_image)

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

        let image_tensor = tfn.tensor(values, outShape, "float32")
        image_tensor = tfn.expandDims(image_tensor, 0)

        const prediction = await model.predict(image_tensor).dataSync()
        const argmax = Math.max(...prediction)
        
        result_data["tumor_scores"] = `${parseFloat(argmax) * 100}%`

        const image = `${request.get('host')}/${filename}`

        const data_push = {
            name: name,
            image: image,
            prediction: result_data
        }

        // const data_res = await tumor_repo.CreatePredictions(data_push)

        // data_res.image = `${request.get('host')}/${data_push.image}`

        return await ResponseApi(enum_.CODE_CREATED, "success", "data has been created", data_push)
    } catch (error) {
        return await ResponseApi(enum_.CODE_BAD_REQUEST, "error", error.message, {})
    }
}