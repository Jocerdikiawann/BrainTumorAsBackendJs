// const MinIO = require('minio')
// const { config_is3, consolog } = require('../../utils')

// let is3 = {}

// if (config_is3.is3.idcloudhost && Object.keys(config_is3.is3.idcloudhost).length > 0) {
//     const endpoint = config_is3.is3.idcloudhost.endpoint
//     const access_key = config_is3.is3.idcloudhost.access_key
//     const secret_key = config_is3.is3.idcloudhost.secret_key
//     const port = config_is3.is3.idcloudhost.port
//     const use_ssl = config_is3.is3.idcloudhost.use_ssl

//     const minIoClient = new MinIO.Client({
//         endPoint: endpoint,
//         accessKey: access_key,
//         secretKey: secret_key,
//         port: parseInt(port),
//         useSSL: (use_ssl == "true")
//     })

//     is3["connections"] = {}
//     is3["connections"].MinIo = MinIO
//     is3["connections"].minIOClient = minIoClient

//     exports.is3 = is3

// } else {
//     consolog.LogDanger("tidak ada is3")
// }