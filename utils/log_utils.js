
const _enum = require('./enum');

exports.LogSuccess = (msg) => {
    console.log(_enum.GREEN_LOG, msg);
}
exports.LogInfo = (msg) => {
    console.log(_enum.CYAN_LOG, msg);
}
exports.LogWarning = (msg) => {
    console.log(_enum.YELLOW_LOG, msg);
}
exports.LogDanger = (msg) => {
    console.log(_enum.RED_LOG, msg);
}