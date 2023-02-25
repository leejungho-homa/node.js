//terminal --> nodemon server.js

const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const MongoClient = require("mongodb").MongoClient; //mongodb 사용을 위한 요청
app.set("view engine", "ejs"); //ejs intall 후에 활용하기 위한 setting

var db; //db저장 활용을 위한 변수 명령
MongoClient.connect(
  "mongodb+srv://leejho1107:1234@cluster0.6qi8chn.mongodb.net/?retryWrites=true&w=majority",
  { useUnifiedTopology: true },
  function (에러, client) {
    if (에러) return console.log(에러); //에러가 나오면 콘솔창 띄우기
    db = client.db("todoapp"); //todoapp 이라는 database 가져오기

    app.listen(8080, function () {
      console.log(`Server listening on port : 8080, http://localhost:8080`);
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
  db.collection("counter").findOne(
    { name: "게시물갯수" },
    function (에러, 결과) {
      var 총게시물갯수 = 결과.totalPost;
      db.collection("post").insertOne(
        { _id: 총게시물갯수 + 1, 제목: req.body.title, 날짜: req.body.date },
        function (에러, 결과) {
          console.log("저장완료");
          //counter라는 콜렉션에 있는 totalPost 항목도 1 증가
          db.collection("counter").updateOne(
            { name: "게시물갯수" },
            { $inc: { totalPost: 1 } }, //update operator 필수임(set은 변경,inc는 증가)
            function (에러, 결과) {
              if (에러) {
                return console.log(에러);
              }
            }
          );
        }
      );
    }
  );
});

//list로 get요청된 것을 db에서 가져와서 보여줌.
app.get("/list", function (req, res) {
  db.collection("post")
    .find()
    .toArray(function (에러, 결과) {
      console.log(결과);
      res.render("list.ejs", { posts: 결과 });
    });
});
