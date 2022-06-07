const { tumor_service } = require("../services");

exports.GetAllPredictions = async (req, res) => {
  const tumor_serv = await tumor_service.GetAllPredictions(req);
  return res.status(tumor_serv.code).json(tumor_serv);
};

exports.GetDetailPredictions = async (req, res) => {
  const tumor_serv = await tumor_service.GetDetailPredictions(req);
  return res.status(tumor_serv.code).json(tumor_serv);
};

exports.CreatePredictions = async (req, res) => {
  const tumor_serv = await tumor_service.Predictions(req);
  return res.status(tumor_serv.code).json(tumor_serv);
};
