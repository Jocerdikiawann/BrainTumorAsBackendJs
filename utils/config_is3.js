const {
    MINIO_ENDPOINT,
    MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY,
    MINIO_PORT,
    MINIO_USE_SSL
} = process.env

module.exports = {
    is3: {
        idcloudhost: {
            endpoint: MINIO_ENDPOINT,
            access_key: MINIO_ACCESS_KEY,
            secret_key: MINIO_SECRET_KEY,
            port: MINIO_PORT,
            use_ssl: MINIO_USE_SSL
        }
    }
}