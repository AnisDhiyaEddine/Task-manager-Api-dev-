const multer = require('multer');

const upload = multer({
    limits:{
        fileSize : 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)/)){
         return    cb(new Error("please Upload jpg or png or jpeg"))  
          }
          cb(undefined,true) 
    }
})


module.exports = upload 