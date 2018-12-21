const appConfig = require('./../../config/config');
const issueController = require('./../controllers/issueController');
const auth = require('./../middlewares/authMiddleware');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 7
    }
})



let baseUrl = `${appConfig.apiVersion}/issue`;
module.exports.setRouter = (app) => {
    app.post(`${baseUrl}/create`, auth.isAuthorized,upload.single('productImage'), issueController.createIssue);
    app.post(`${baseUrl}/update`, auth.isAuthorized,upload.single('productImage'), issueController.updateIssue);
    app.post(`${baseUrl}/watcher`, auth.isAuthorized, issueController.addAssWatcher);
    app.post(`${baseUrl}/comment`, auth.isAuthorized, issueController.addComment);
    // app.post(`${baseUrl}/upload`, auth.isAuthorized, upload.single('productImage'), issueController.uploadImage);
    app.get(`${baseUrl}/:bugId/listComment`, auth.isAuthorized, issueController.listComment);
    // app.get(`${baseUrl}/:bugId/getLink`, auth.isAuthorized, issueController.getLink);
    app.get(`${baseUrl}/listWatcher/:bugId`, auth.isAuthorized, issueController.listWatchers);
    app.get(`${baseUrl}/search`, auth.isAuthorized, issueController.fuzzySearch);
    app.post(`${baseUrl}/viewYourIssue`, auth.isAuthorized, issueController.viewIssueAssignedToYou);

}

