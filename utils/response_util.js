
exports.ResponseApi = async (code, status, message, data) => {
    return await {
        code: code,
        status: status,
        message: message,
        data: data
    }
}