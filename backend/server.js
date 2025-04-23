// Import dependencies
import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';// Import the MongoDB connection function
import cookieParser from 'cookie-parser';
import userRoute from './routes/user.route.js';
import cardRoute from './routes/card.route.js'; // Import cardRoute
import postImageRoute from './routes/post.image.route.js'; // Import postRoute
import postVideoRoute from './routes/post.video.route.js'; 
import postBlogRouter from './routes/post.blog.route.js';


 // Load environment variables from .env file
dotenv.config({});

// Initialize express app
const app = express();

const PORT = process.env.PORT || 3000;


// // Middleware to parse incoming JSON requests
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
}
app.use(cors(corsOptions));

// // Call the function to connect to the database
connectDB();

// Basic route
app.get('/', (_, res) => {
  res.send('Hello from the backend!');
});

//yha pr apni API likhna h

app.use("/api/v1/user",userRoute);
app.use("/api/v1/card",cardRoute);
app.use("/api/v1/postImage",postImageRoute);
app.use("/api/v1/postVideo",postVideoRoute);
app.use("/api/v1/postBlog",postBlogRouter);



// Set the server to listen on a specified port
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
