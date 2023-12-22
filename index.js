const express = require('express');
const connectedDb = require("./config/db")
const  cors = require('cors')

//Routes
const userRouter = require("./routes/userRoute");
const seedRouter = require("./routes/seedRoute")
const moviesRouter = require("./routes/movieRoute");
const actorRouter = require("./routes/actorRoute");
const producerRouter = require("./routes/producerRoute");

const app = express();
app.use(cors());
app.use(express.json());



// db connection
connectedDb();



// Update your route paths to be more specific
app.use('/api/seed', seedRouter);
app.use('/api/auth', userRouter);
app.use('/api', moviesRouter);
app.use('/api', producerRouter);
app.use('/api', actorRouter);





// server connection
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
