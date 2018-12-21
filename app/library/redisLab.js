const check = require("./checkLib.js");
const redis = require('redis');
let client = redis.createClient({
    url:'redis://redis-19107.c81.us-east-1-2.ec2.cloud.redislabs.com:19107',
    no_ready_check:true,
    password:'uXq8Nu3KaVoTog6IZQqJknaST4vaFjYQ'
})


client.on('connect',() =>{
    console.log("Redis connection open success");
});

let getWatchersFromAIssueInAHash = (hashName,callBack) =>{
    console.log(hashName);
    client.HGETALL(hashName,(err,result) =>{
        if(err){
            console.log(err);
            callBack(err,null);
        }
        else if(check.isEmpty(result)){
            console.log("User list is empty");
            console.log(result);
            callBack(null,{});
        }
        else{
            console.log(result);
            callBack(null,result);
        }
    });
};

let setWatcherToAIssueInAHash = (hashName,key,value,callBack) =>{
    client.HMSET(hashName,[key,value],(err,result) =>{
        if(err){
            console.log(err);
            callBack(err,null);
        }
        else{
            console.log("User set online successfully");
            console.log(result);
            callBack(null,result);
        }
    });
};

let deleteFromAHash = (hashName,key) =>{
    client.HDEL(hashName,key);
    return true;
};

module.exports = {
    getWatchersFromAIssueInAHash: getWatchersFromAIssueInAHash,
    setWatcherToAIssueInAHash: setWatcherToAIssueInAHash,
    deleteFromAHash: deleteFromAHash
};