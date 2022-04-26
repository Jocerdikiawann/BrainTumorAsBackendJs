// const { consolog } = require('../../utils')
// const { is3 } = require('../db')
// const { BUCKET_NAME } = process.env
// const fs = require('fs')

// exports.UploadImage = async (image_name, image_path) => {

//     const metaData = {
//         'Content-Type': 'application/octet-stream',
//         'X-Amz-Meta-Testing': 1234,
//         'example': 5678
//     }

//     await is3.is3.connections.minIOClient.putObject(BUCKET_NAME, image_name, image_path, metaData, function (err, objInfo) {
//         if (err) {
//             consolog.LogDanger(err)
//             return false
//         } else {
//             fs.unlinkSync(image_path)
//             return true
//         }
//     })
// }