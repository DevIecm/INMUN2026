const { response } = require("express");

const testPost = async (req, res = response) => {
    res.send({
        ok: true,
        msg: 'Servicio activo!'
    });
}



module.exports = {
    testPost
}