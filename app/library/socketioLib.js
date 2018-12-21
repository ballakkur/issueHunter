const socketio = require('socket.io');

const tokenLib = require('./tokenLib');

const shortId = require('shortid');

// const redisLib = require('./redisLab');

const events = require('events');
const eventEmitter = new events.EventEmitter();

const mongoose = require('mongoose');

// const notificationModel = mongoose.model('Notification');

let setServer = (server) => {
    // required to create a connection,initialize the socketio,syntax of initializing socketio
    let io = socketio.listen(server);
    let myIo = io.of('issueTrackingTool');
    let currentUser;

    myIo.on('connection', (socket) => {



        console.log("Socket connection");
        socket.emit("verify-user", "");
        socket.on('set-user', (authToken) => {
            console.log('set-user');
            tokenLib.verifyClaimsWithoutSecret(authToken, (err, user) => {
                if (err) {
                    socket.emit('auth-error', { status: 401, error: 'Please provide correct auth token' })
                    /**
                    * @api {emit} auth-error emit authentication error
                    * @apiVersion 1.0.0
                    * @apiGroup Emit 
                    *@apiDescription This event is emmited when the auth token provided by user cannot be verified
                   */
                }

                else {
                    console.log("User is verified setting details");
                    currentUser = user.data;
                    socket.userId = currentUser.userId;
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`;
                    console.log(fullName + " is online");

                    // joining our issues which we are watching

                    redisLib.getWatchersFromAIssueInAHash(currentUser.userId, (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(result);
                            for (let r in result) {
                                console.log(r);
                                socket.join(r);
                                console.log("Joined");
                            }
                        }

                    });


                }
            });
        });

        socket.on('watching-to-a-issue', (data) => {
            // issueId,userId,userName,issueTitle
            console.log(data);
            let key = data.userId;
            let value = data.userName;
            redisLib.setWatcherToAIssueInAHash(data.issueId, key, value, (err, result) => {
                if (err) {
                    console.log('some error occured');
                }
                else {
                    redisLib.getWatchersFromAIssueInAHash(data.issueId, (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            // saving each users issue
                            let key1 = data.issueId;
                            let value1 = data.issueTitle;
                            redisLib.setWatcherToAIssueInAHash(data.userId, key1, value1, (err, result1) => {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    console.log(result);
                                    console.log(data.issueId);
                                    socket.join(data.issueId);
                                    console.log("Joined");
                                    socket.emit(data.issueId, result);

                                }
                            });
                        }
                    });
                }
            });
        });




        socket.on('get-watcher-list', (issueId) => {
            // issueId
            redisLib.getWatchersFromAIssueInAHash(issueId, (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(result);
                    socket.emit(issueId, result);
                }
            });
        });


        socket.on('broadcast-to-watchers', (data) => {
            // issueId,what modified,name of the modifier
            socket.to(data.issueId).broadcast.emit('notify-watchers', data);
            // socket.to(data.issueId).broadcast.emit(data.issueId,data);
            console.log("Broadcasting all watchers");
            console.log(data);

        });










        // disconnect
        // As we close the client side browsers tab,disconnect event emits
        socket.on('disconnect', () => {
            console.log("User is disconnected");
            console.log(socket.userId);

        });
        // we are creating this event to delete the user from online user,because above functions only calls up on closing the window
        socket.on('logout', () => {
            console.log("Logging out");
            console.log(socket.userId);
        });

    });

}; // end of setServer


module.exports = {
    setServer: setServer
};