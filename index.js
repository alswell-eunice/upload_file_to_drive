const express = require("express");
const app = express();
const fileRouter = require("./routers/fileRouter");
require("dotenv").config();

const port = process.env.PORT

app.get('/', (_, res) => {
    res.sendFile(`${__dirname}/index.html`);
  });
    
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello from Drive API server");
});

app.use("/file", fileRouter);

app.listen(port, () => {
  console.log("server has started");
});