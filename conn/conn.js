const mongoose = require("mongoose");
require("dotenv").config();  // Load environment variables

const conn = async () => {
    try {
        console.log("MongoDB URI:", process.env.URI);  // Debugging

        await mongoose.connect(process.env.URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
    }
};

conn();
