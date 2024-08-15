const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("La conexion fue exitosa");
  })
  .catch((err) => {
    console.log(err);
  });
