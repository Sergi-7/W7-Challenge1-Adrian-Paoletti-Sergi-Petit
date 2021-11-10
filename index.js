require("dotenv").config();
const connectDB = require("./database/index");
const { initializeServer } = require("./server/index")

const port = process.env.SERVER_PORT ?? 4000;

(async () => {
  try {
    await connectDB(process.env.MONGODB);
    initializeServer(port);
    console.log("success")
  } catch (error) {
    console.log("aloo")
    process.exit(1)
  }
})();