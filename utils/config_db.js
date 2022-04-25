const {
    MONGO_HOST,
    MONGO_PORT,
    MONGO_DB_NAME,
    MONGO_MODEL,
    MONGO_ENABLED
} = process.env

module.exports = {
    db: {
        mongodb: {
            enabled: MONGO_ENABLED,
            host: MONGO_HOST,
            port: MONGO_PORT,
            database: MONGO_DB_NAME,
            nameconnection: MONGO_MODEL
        }
    }
}