var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const collections = require('../config/collections')
module.exports = {
    doSignup:(userData)=>{

        return new Promise(async (resolve,reject)=>{

            userData.Password = await bcrypt.hash(userData.Password,10);

            const userCollection = db.get().collection(collection.USER_COLLECTION);

            userCollection.insertOne(userData).then((data)=>{
                const insertedId = data.insertedId;
                userCollection.findOne({_id:insertedId}).then((user)=>{
                    console.log(user);
                    resolve(user)
                }) 
            })
        })
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus = false;
            let response = {}

            let user = await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log("login successfull");
                        response.user = user;
                        response.status = true;
                        resolve(response)

                    }else{
                        console.log("login failed");
                        resolve({status:false})
                    }
                })
            }else{
                console.log("login failed");
                resolve({status:false})
            }
        })
    }

}
