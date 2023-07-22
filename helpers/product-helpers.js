const db = require('../config/connection')
const collection = require('../config/collections')
const fs = require('fs')
const ObjectId = require('mongodb').ObjectId
const path = require('path')
module.exports = {
    addProduct:(product,callback)=>{
        
        db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data)=>{
            console.log(data);
            callback(data)
            
        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products =await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    deleteProduct:(proId,image)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:ObjectId(proId)}).then((deleteResult)=>{
                // console.log(response);
                const imageName = image.concat('.jpg')
                const imagePath = path.join(__dirname,'..','public','product-images',imageName)
                fs.unlink(imagePath,(err)=>{
                    if(err){
                        console.log(`Error deleting file ${imagePath}:${err}`);
                    }
                });
                console.log(deleteResult);
                resolve(deleteResult);
            })
        })
    },
    getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({_id:ObjectId(proId)},{
                $set:{
                    Name:proDetails.Name,
                    Description:proDetails.Description,
                    Price:proDetails.Price,
                    Category:proDetails.Category
                }
            }).then((response)=>{
                resolve()
            })
        })
    }
}