var express = require('express')
var multer = require("multer");
var path = require("path")
var mysql = require('mysql')
var app = express()
const http = require('http')

const config = require('config');
const db = require('./db');

app.listen(3000, function () {
    console.log('Node server is running')
})


var httpServer = http.createServer(app)

const port = config.port;
const env = process.env.NODE_ENV || 'staging'

//configure middlewares
const middlewares = require('./middlewares')(app);
middlewares.configureMiddlewares();

//configure routes
const routerIndex = require('./routes')(app);
routerIndex.registerRoutes();

app.get('/home', function () {
    try {
        return db.cars.findAll()
    } catch (error) {
        throw error
    }
})

app.get('/hello',function(){
    console.log("Hello Le Pham Thanh Hai")
})


// Khởi tạo biến cấu hình cho việc lưu trữ file upload
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
      let filename = `${Date.now()}-trungquandev-${file.originalname}`;
      callback(null, filename);
    }
  });
  // Khởi tạo middleware uploadFile với cấu hình như ở trên,
  // Bên trong hàm .single() truyền vào name của thẻ input, ở đây là "file"
  let uploadFile = multer({storage: diskStorage}).single("file");
  // Route này Xử lý khi client thực hiện hành động upload file
  app.post("/upload", (req, res) => {
    // Thực hiện upload file, truyền vào 2 biến req và res
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
  });













db.connect()
    .then((sql) => {
        console.log(`Connected DB: ${sql.config.database} with host: ${sql.config.host}:${sql.config.port}`)

        httpServer.listen(port, () => {
            console.log(`Running http server in:and listening on port:${port}`)
        })

        // start cron job
        if (config.runCron) {
            console.log("cron job started!")
            cron.startCronJob();
        }

    })
    .catch((error) => {
        console.error('@error', error);
        process.exit();
});