const isImage = require("is-base64");
const base64 = require("base64-img");
const { ResponseApi, enum_, consolog, utils } = require("../../utils");
const { tumor_repo } = require("../repository");
const tf = require("@tensorflow/tfjs");
const tfn = require("@tensorflow/tfjs-node");
const model_json = "./tfjs_model/model.json";
const fs = require("fs");

exports.GetAllPredictions = async (request) => {
  try {
    const tumor_media = await tumor_repo.GetAllPredictions();
    const mapped_tumor_media = tumor_media.map((m) => {
      m.image = `${request.get("host")}/images/${m.image}`;
      return m;
    });
    return await ResponseApi(
      enum_.CODE_OK,
      "success",
      "data prediction has been sent",
      mapped_tumor_media
    );
  } catch (error) {
    return await ResponseApi(
      enum_.CODE_BAD_REQUEST,
      "error",
      error.message,
      {}
    );
  }
};

exports.GetDetailPredictions = async (request) => {
  try {
    const { id } = request.params;
    const tumor = await tumor_repo.GetDetailPredictionById(id);

    if (!tumor) {
      return await ResponseApi(
        enum_.CODE_NOT_FOUND,
        "error",
        "id not found",
        {}
      );
    }

    return await ResponseApi(
      enum_.CODE_OK,
      "success",
      "data has been sent",
      tumor
    );
  } catch (error) {
    return await ResponseApi(
      enum_.CODE_BAD_REQUEST,
      "error",
      error.message,
      {}
    );
  }
};

exports.Predictions = async (request) => {
  try {
    const image_origin = request.body.image;
    const name = request.body.name;

    const INPUT_SIZE = 64;
    const NUM_OF_CHANNELS = 3;

    let labels = ["non_tumor_scores", "tumor_scores"];
    let result_data = {};

    if (!isImage(image_origin, { mimeRequired: true })) {
      return await ResponseApi(
        enum_.CODE_BAD_REQUEST,
        "error",
        "invalid base64",
        {}
      );
    }

    const handler = tfn.io.fileSystem(model_json);
    const model = await tfn.loadLayersModel(handler);
    model.summary();

    const filepath = base64.imgSync(
      image_origin,
      "./public/images",
      Date.now()
    );

    const filename = filepath.split("/").pop();
    const buf = fs.readFileSync(`./${filepath}`);
    const tensor = tfn.node.decodeImage(buf, NUM_OF_CHANNELS);
    let resize = tensor.resizeBilinear([64, 64]);
    resize = tf.expandDims(resize, 0);
    const prediction = await model.predict(resize).data();
    consolog.LogDanger(prediction);
    const result = {
      probability: `${Math.floor(prediction[1] * 100)}%`,
      origin_value: prediction,
    };
    model.dispose();
    resize.dispose();
    return await ResponseApi(
      enum_.CODE_CREATED,
      "success",
      "data has been created",
      result
    );
  } catch (error) {
    return await ResponseApi(
      enum_.CODE_BAD_REQUEST,
      "error",
      error.message,
      {}
    );
  }
};
