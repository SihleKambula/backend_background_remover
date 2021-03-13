const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer");
const cors = require("cors");
const request = require("request");

// PORT
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.static("public"));

fs.mkdir("public", () => {
  console.log("Public folder created");
});
//store the file in a public folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// an upload instance to receive a single file
// the file functionq
const upload = multer({ storage }).single("image");

app.get("/", (req, res) => {
  res.status(200).send("Server up and running");
});

app.post("/upload", upload, (req, res) => {
  // console.log(req.file);
  try {
    request.post(
      {
        url: "https://api.remove.bg/v1.0/removebg",
        formData: {
          image_file: fs.createReadStream(
            `${__dirname}/public/${req.file.filename}`
          ),
          size: "auto",
        },
        headers: {
          "X-Api-Key": "Zjh7vPYRyswnMwZEuKzUYVkh",
        },
        encoding: null,
      },
      function (error, response, body) {
        if (error) return console.error("Request failed:", error);
        if (response.statusCode != 200)
          return console.error(
            "Error:",
            response.statusCode,
            body.toString("utf8")
          );
        fs.writeFileSync(`no-bg.png`, body);

        console.log("done");
        res.status(201).json({
          mesg: "done",
          pic: fs.createReadStream(`${__dirname}/no-bg.png`),
        });
      }
    );
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
s;
