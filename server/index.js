const axios = require("axios");
var express = require('express');
var router = express.Router();

exports.handler = async (event) => {
    // TODO implement
    console.info(event)

    try {
        const result = await axios.post("웹훅 주소", {
            "content": event.Records[0].dynamodb.NewImage.user.S + " 농부가 " + JSON.stringify(event.Records[0].dynamodb.NewImage.title.S) + " 업적을 달성했습니다!"
        });
        console.info("디스코드 웹훅 성공");
    } catch (err) {
        console.err("디스코드 웹훅 실패", err);
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};

/* GET home page */
router.get('/main', (req, res) => {
    const data = req.body.data;
    res.send("문자열이 응답됩니다.");
});

module.exports = router;