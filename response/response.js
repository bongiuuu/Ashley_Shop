
// TODO rename to ResponseHandler.
class CResponse {
    ok(res, data, code) {
        code = code ? code : 200
        res.status(code).send({ code: code, message: 'Success', data: data })
    }

    fail(res, message, code) {
        code = code ? code : 400
        res.status(code).send({ code: code, message: message, data: null })
    }

    render(res, file ,  data){
        //console.log("render :", file , data);
        res.render(file , data);
        
    }

    renderImage(res , data){
        res.contentType('image/png');
        res.send(data)
    }
}
module.exports = new CResponse()