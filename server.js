const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const MongoClient = require("mongodb").MongoClient; //mongodb 사용을 위한 요청

var db; //db저장 활용을 위한 변수 명령
MongoClient.connect(
  "mongodb+srv://leejho1107:1234@cluster0.6qi8chn.mongodb.net/?retryWrites=true&w=majority",
  { useUnifiedTopology: true },
  function (에러, client) {
    if (에러) return console.log(에러); //에러가 나오면 콘솔창 띄우기
    db = client.db("todoapp"); //todoapp 이라는 database 가져오기

    db.collection("post").insertOne(
      { 이름: "John", _id: 100 },
      function (에러, 결과) {
        console.log("저장완료");
      }
    ); //post라는 collection에서 저장하기

    app.listen(8080, function () {
      console.log("listening on 8080");
    });
  }
);

//html을 가져오기
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.get("/write", function (req, res) {
  res.sendFile(__dirname + "/write.html");
});

//html 안에 form 내용 post(서버에 저장하기)
app.post("/add", function (req, res) {
  res.send("전송완료");
  console.log(req.body.title);
  console.log(req.body.date);
});
