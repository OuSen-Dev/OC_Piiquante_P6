// replace USER, PASSWORD, & MARQUE by yours in .env file

const { default: mongoose } = require("mongoose");
  mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Successful connection to MongoDB"))
  .catch(() => console.log("Unsuccessful connection to MongoDB"));
  