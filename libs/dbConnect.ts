import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

export default async function dbConnect() {

    if (connection.isConnected) {
        console.log("Already connected to database");
        return;
    }

    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI}` || "");
        connection.isConnected = db.connections[0].readyState;
        console.log("Successfully connected to database");
    } catch (error) {
        console.log("Failed to connect to database", error);
        process.exit(1);
    }
}