let appConfig = {};

appConfig.port = process.env.port || 8080;
appConfig.allowedCorsOrigin = "*";
appConfig.env = "dev";
appConfig.db = {
    url: 'mongodb://127.0.0.1:27017/issueTrackerDB'
}
appConfig.apiVersion = '/api/v1';


module.exports = {
    port: appConfig.port,
    allowedCorsOrigin: appConfig.allowedCorsOrigin,
    environment: appConfig.env,
    db: appConfig.db,
    apiVersion: appConfig.apiVersion
};