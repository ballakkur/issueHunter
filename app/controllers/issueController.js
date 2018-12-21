const mongoose = require('mongoose');
const shortId = require('shortid');


//libraries
const response = require('./../library/responseLib');
const check = require('./../library/checkLib');
const regex = require('./../library/regexSearch');


//models
const userModel = mongoose.model('User');
const issueModel = mongoose.model('Issue');
const watcherModel = mongoose.model('Watcher');
const CommentModel = mongoose.model('Comment');


let createIssue = (req, res) => {

    let saveIssue = (req, res) => {

        return new Promise((resolve, reject) => {

            let id = shortId.generate();
            console.log(req.user.userId);
            if (check.isEmpty(req.body.title) || check.isEmpty(req.body.status) || check.isEmpty(req.body.description)) {
                let apiResponse = response.generate(true, 'parameters missing', 400, null);
                // res.status(apiResponse.status).send(apiResponse);
                reject(apiResponse);
            } else {
                // console.log(req.body);
                userModel.find({ userId: req.user.userId })
                    .select('userName')
                    .then((userName) => {
                        console.log(userName);
                        let issue = new issueModel({
                            bugId: id,
                            title: req.body.title,
                            status: req.body.status,
                            description: req.body.description,
                            reporterId: req.user.userId,
                            reporterName: userName[0].userName,
                            assignedToId: req.body.assignedToId || 'not yet assigned',
                            assignedToName: req.body.assignedToName || 'not yet assigned'
                        });
                        issue.save()
                            .then((data) => {
                                let x = data.toObject()
                                delete x.__v
                                delete x._id
                                // console.log(x)
                                let apiResponse = response.generate(false,
                                    'issue created', 200, x);
                                // res.status(200).send(apiResponse);
                                resolve(apiResponse);
                            })
                            .catch((err) => {
                                console.log(err);
                                let apiResponse = response.generate(true,
                                    'could not create issue', 500, err.message);
                                // res.status(500).send(apiResponse);
                                reject(apiResponse);
                            })
                    })
                    .catch((err) => {
                        console.log(err);
                        let apiResponse = response.generate(true, 'db error', 500, null);
                        // res.status(apiResponse.status).send(apiResponse);
                        reject(apiResponse);
                    })
                let watcher = new watcherModel({
                    bugId: id
                })
                watcher.save()
                    .then((data) => console.log(data))
                    .catch((err) => console.log(err))
            }
        })
    }
    let saveImage = (apiResponse) => {
        // console.log(apiResponse);
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.file)) {
                console.log(req.file);
                console.log('no image')
                res.status(200).send(apiResponse);
            } else {
                issueModel.updateOne({ bugId: apiResponse.data.bugId }, { image: `http://api.issuehunter.tk/${req.file.path}` })
                    .then((result) => {
                        console.log(result);
                        if (result.nModified === 1) {
                            apiResponse.data.path = `http://api.issuehunter.tk/${req.file.path}`
                            res.status(200).send(apiResponse);
                        } else {
                            res.status(200).send(apiResponse);
                        }
                    })
                    .catch((err) => {
                        console.log('final', err);
                        let apiResponse = response.generate(true, 'db error', 500, null);
                        // res.status(apiResponse.status).send(apiResponse);
                        reject(apiResponse);
                    })
            }
        })

    }
    saveIssue(req, res)
        .then(saveImage)
        .catch(apiResponse => res.status(apiResponse.status).send(apiResponse))

}

let updateIssue = (req, res) => {

    let otherUpdate = (req,res)=>{
        
        return new Promise((resolve,reject)=>{
    
            if (check.isEmpty(req.body.title) || check.isEmpty(req.body.status) || check.isEmpty(req.body.description) || check.isEmpty(req.body.bugId)) {
                let apiResponse = response.generate(true, 'parameters missing', 400, null);
                // res.status(apiResponse.status).send(apiResponse);
                reject(apiResponse);
            } else {
                if (check.isEmpty(req.body.assignedToId) || check.isEmpty(req.body.assignedToName)) {
                    issueModel.findOneAndUpdate({ bugId: req.body.bugId }, {
                        $set: {
                            title: req.body.title,
                            status: req.body.status,
                            description: req.body.description
                        }
                    })
                        .then((result) => {
                            console.log(result)
                            let apiResponse = response.generate(false, 'updated', 200,result);
                            // res.status(apiResponse.status).send(apiResponse);
                            resolve(apiResponse);
                        })
                        .catch((err) => {
                            console.log(err);
                            let apiResponse = response.generate(true, 'db error', 500, null);
                            // res.status(apiResponse.status).send(apiResponse);
                            reject(apiResponse);
                        })
                } else {
        
                    issueModel.findOneAndUpdate({ bugId: req.body.bugId }, {
                        $set: {
                            title: req.body.title,
                            status: req.body.status,
                            description: req.body.description,
                            assignedToId: req.body.assignedToId,
                            assignedToName: req.body.assignedToName
                        }
                    })
                        .then((result) => {
                            // console.log(result);
                            let apiResponse = response.generate(false, 'updated', 200, result);
                            // res.status(apiResponse.status).send(apiResponse);
                            resolve(apiResponse);
                        })
                        .catch((err) => {
                            console.log(err);
                            let apiResponse = response.generate(true, 'db error', 500, null);
                            // res.status(apiResponse.status).send(apiResponse);
                            reject(apiResponse);
                        })
                }
            }
        })
    }

    let imageUpdate = (apiResponse)=>{
         console.log('image',apiResponse);
         return new Promise((resolve, reject) => {
            if (check.isEmpty(req.file)) {
                console.log(req.file);
                console.log('no image')
                res.status(200).send(apiResponse);
            } else {
                issueModel.updateOne({ bugId: apiResponse.data.bugId }, { image: `http://api.issuehunter.tk/${req.file.path}` })
                    .then((result) => {
                        console.log('update',result);
                        if (result.nModified === 1) {
                            apiResponse.data.path = `http://api.issuehunter.tk/${req.file.path}`
                            console.log(apiResponse.data.path)
                            res.status(200).send(apiResponse);
                        } else {
                            res.status(200).send(apiResponse);
                            console.log('eror')
                        }
                    })
                    .catch((err) => {
                        console.log('final', err);
                        let apiResponse = response.generate(true, 'db error', 500, null);
                        // res.status(apiResponse.status).send(apiResponse);
                        reject(apiResponse);
                    })
            }
        })
    }

    otherUpdate(req,res)
        .then(imageUpdate)
        .catch(apiResponse => res.status(apiResponse.status).send(apiResponse))

}

let addAssWatcher = (req, res) => {
    let findUserName = () => {
        return new Promise((resolve, reject) => {

            if (check.isEmpty(req.body.bugId)) {
                let apiResponse = response.generate(true, 'bugId missing', 404, null);
                res.status(apiResponse.status).send(apiResponse);
            } else {
                console.log(req.user.userId);
                userModel.find({ userId: req.user.userId })
                    .select('firstName lastName -_id')
                    .then((data) => {
                        // console.log(userName);
                        resolve(data);
                    })
                    .catch((err) => {
                        console.log(err);
                        let apiResponse = response.generate(true, 'could not add you', 500, null);
                        reject(apiResponse);
                    })
            }
        })

    }
    let addWatcher = (data) => {
        console.log(data)
        return new Promise((resolve, reject) => {

            watcherModel.updateOne({ bugId: req.body.bugId }, {
                $addToSet: {
                    watcherName: `${data[0].firstName} ${data[0].lastName}`
                }
            })
                .then((modified) => {
                    console.log(modified);
                    if (modified.nModified == 1) {
                        let apiResponse = response.generate(false, 'successfully added you as watcher', 200, null);
                        res.status(200).send(apiResponse);
                    } else {
                        let apiResponse = response.generate(false, 'you are already watching', 200, null);
                        res.status(400).send(apiResponse);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    let apiResponse = response.generate(true, 'could not add you', 500, null);
                    reject(apiResponse)
                })
        })
    }
    findUserName(req, res)
        .then((userName) => addWatcher(userName))
        .catch((apiResponse) => res.status(apiResponse.status).send(apiResponse))
}

let listWatchers = (req, res) => {
    console.log(req.params.bugId);
    watcherModel.find({ bugId: req.params.bugId })
        .select('watcherName -_id')
        .then((data) => {
            let apiResponse = response.generate(false, 'watchers listed', 200, data);
            res.status(apiResponse.status).send(apiResponse);
        })
        .catch((err) => {
            console.log(err);
            let apiResponse = response.generate(true, 'db error', 500, null);
            res.status(apiResponse.status).send(apiResponse);
        })
}

let viewIssueAssignedToYou = (req, res) => {

    issueModel.find({ assignedToId: req.user.userId })
        .select('-_id -__v')
        .then((data) => {
            if (check.isEmpty(data)) {
                let apiResponse = response.generate(false, 'no issue assigned to you', 200, null);
                res.status(apiResponse.status).send(apiResponse);
                return
            } else {
                let apiResponse = response.generate(false,
                    'issues fetched', 200, data);
                res.status(200).send(apiResponse);
                return
            }
        })
        .catch((err) => {
            console.log(err)
            let apiResponse = response.generate(true, 'db error', 500, null);
            res.status(apiResponse.status).send(apiResponse);
        })
}

let addComment = (req, res) => {

    if (check.isEmpty(req.body.bugId) || check.isEmpty(req.body.commentString)) {
        let apiResponse = response.generate(true, 'parameters missing', 404, null);
        res.status(apiResponse.status).send(apiResponse);
    } else {
        userModel.find({ userId: req.user.userId })
            .select('firstName lastName -_id')
            .then((data) => {
                console.log(data)
                let comment = new CommentModel({
                    bugId: req.body.bugId,
                    comment: req.body.commentString,
                    commentatorName: `${data[0].firstName} ${data[0].lastName}`
                })
                comment.save()
                    .then((data) => {
                        console.log(data);
                        let apiResponse = response.generate(false, 'commented!', 200, data);
                        res.status(apiResponse.status).send(apiResponse);
                    })
                    .catch((err) => {
                        console.log(err)
                        let apiResponse = response.generate(true, 'db error', 500, null);
                        res.status(apiResponse.status).send(apiResponse);
                    })
            })
            .catch((err) => {
                console.log(err)
                let apiResponse = response.generate(true, 'db error', 500, null);
                res.status(apiResponse.status).send(apiResponse);
            })

    }
}

let listComment = (req, res) => {
    if (check.isEmpty(req.params.bugId)) {
        let apiResponse = response.generate(true, 'bugId missing', 404, null);
        res.status(apiResponse.status).send(apiResponse);
    } else {
        CommentModel.find({ bugId: req.params.bugId })
            .select('-_id -__v')
            .then((data) => {
                console.log(data);
                let apiResponse = response.generate(false, 'comments fetched', 200, data);
                res.status(apiResponse.status).send(apiResponse);
            })
            .catch((err) => {
                console.log(err)
                let apiResponse = response.generate(true, 'db error', 500, null);
                res.status(apiResponse.status).send(apiResponse);
            })
    }
}

/* let uploadImage = (req,res)=>{
    console.log(req.file);

    ImageModel.find({bugId:req.body.bugId})
    .select('-_id -__v')
    .then((data)=>{
        console.log(data);
        if(check.isEmpty(data)){
            let newImage = new ImageModel({
                bugId:req.body.bugId,
                imageUrl:req.file.path
            })
            newImage.save()
            .then((data)=>{
                console.log(data);
                let apiResponse = response.generate(false, 'image uploaded',200,data);
                res.status(apiResponse.status).send(apiResponse);
            })
            .catch((err) => {
                console.log(err);
                let apiResponse = response.generate(true, 'db error', 500, null);
                res.status(apiResponse.status).send(apiResponse);
            })
        }
        else{
            ImageModel.updateOne({bugId:req.body.bugId},{imageUrl:req.file.path})
            .then((data)=>{
                console.log(data);
                if(data.nModified === 1){

                    let apiResponse = response.generate(false, 'image uploaded',200,data);
                    res.status(apiResponse.status).send(apiResponse);
                }
            })
            .catch((err) => {
                console.log(err);
                let apiResponse = response.generate(true, 'db error', 500, null);
                res.status(apiResponse.status).send(apiResponse);
            })
        }
    })
    .catch((err) => {
        console.log(err)
        let apiResponse = response.generate(true, 'db error', 500, null);
        res.status(apiResponse.status).send(apiResponse);
    })
} */

/* let getLink = (req,res)=>{
    if (check.isEmpty(req.params.bugId)) {
        let apiResponse = response.generate(true, 'bugId missing', 404, null);
        res.status(apiResponse.status).send(apiResponse);
    }else{
        ImageModel.find({bugId:req.params.bugId})
        .select('-_id -__v')
        .then((data)=>{
            console.log(data);
            let apiResponse = response.generate(false, 'image Link fetched fetched',200,data);
            res.status(apiResponse.status).send(apiResponse);
        })
        .catch((err) => {
            console.log(err)
            let apiResponse = response.generate(true, 'db error', 500, null);
            res.status(apiResponse.status).send(apiResponse);
        })
    }
    
} */

let fuzzySearch = (req,res)=>{

    //get a search query from client and use regex to search database
    // console.log(req.query.key);
    // console.log(regex.escapeRegex(req.query.key));
    if(check.isEmpty(req.query.key)){
        let apiResponse  = response.generate(true,'enter key',404,null);
        res.status(404).send(apiResponse);
    }else{

        const regexValue = new RegExp(regex.escapeRegex(req.query.key), 'gi');
        console.log(regexValue);
        issueModel.find({title:regexValue})
        .select('-id -_v')
        .then((result)=>{
            if(check.isEmpty(result)){
                let apiResponse = response.generate(false,'not found',200,null);
                res.status(200).send(apiResponse);
            }else{
                let apiResponse = response.generate(false,'lo data',200,result);
                res.status(200).send(apiResponse);
            }
        })
        .catch((err) => {
            console.log(err)
            let apiResponse = response.generate(true, 'db error', 500, null);
            res.status(apiResponse.status).send(apiResponse);
        })
    }
}

module.exports = {
    createIssue,
    updateIssue,
    addAssWatcher,
    listWatchers,
    viewIssueAssignedToYou,
    addComment,
    listComment,
    fuzzySearch
    // uploadImage,
    // getLink
}