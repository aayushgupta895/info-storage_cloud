var userId = null;

function setUserId(data){
    userId = data;
} 

function getUserId(){
    return userId
}

module.exports = {getUserId, setUserId}