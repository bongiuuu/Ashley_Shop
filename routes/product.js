const productHandler = require('../core/handler/product.handler');
const cResponse = require('../response/response');
var express = require('express')
var router = express.Router()
var multer = require("multer");
var path = require("path")
class Product {
    productRoutes() {
        router.route('/').post((req, res, next) => {
            let query = req.query
            return productHandler.add(req).then((product) => {
                cResponse.ok(res, product)
            }).catch((error) => {
                cResponse.fail(res, error.message)
            })
        });


        router.route('/').get((req, res, next) => {
            let query = req.query
            return productHandler.getAll(query).then((product) => {
                cResponse.ok(res, product)
            }).catch((error) => {
                cResponse.fail(res, error.message)
            })
        });

        let diskStorage = multer.diskStorage({
            destination: (req, file, callback) => {
              // Định nghĩa nơi file upload sẽ được lưu lại
              callback(null, "uploads");
            },
            filename: (req, file, callback) => {
              // ở đây các bạn có thể làm bất kỳ điều gì với cái file nhé.
              // Mình ví dụ chỉ cho phép tải lên các loại ảnh png & jpg
              let math = ["image/png", "image/jpeg"];
              if (math.indexOf(file.mimetype) === -1) {
                let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
                return callback(errorMess, null);
              }
              // Tên của file thì mình nối thêm một cái nhãn thời gian để đảm bảo không bị trùng.
              let filename = `${Date.now()}-hailpt-${file.originalname}`;
              callback(null, filename);
            }
          });

        router.route('/upload').post((req, res, next) => {

            let uploadFile = multer({storage: diskStorage}).single("file");
            uploadFile(req, res, (error) => {
                // Nếu có lỗi thì trả về lỗi cho client.
                // Ví dụ như upload một file không phải file ảnh theo như cấu hình của mình bên trên
                if (error) {
                  return res.send(`Error when trying to upload: ${error}`);
                }
                
                // Không có lỗi thì lại render cái file ảnh về cho client.
                // Đồng thời file đã được lưu vào thư mục uploads
        
                res.sendFile(path.join(`${__dirname}/uploads/${req.file.filename}`));
              });


            // let query = req.query
            // return productHandler.add(req).then((product) => {
            //     cResponse.ok(res, product)
            // }).catch((error) => {
            //     cResponse.fail(res, error.message)
            // })
        });

        return router;
    }
}
const productRoutes = new Product();
module.exports = productRoutes.productRoutes();