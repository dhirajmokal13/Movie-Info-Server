import Mongoose from "mongoose";
Mongoose.set('strictQuery', false);

const mongooseConnection = async (DATABASE_URL) => {
    try {
        await Mongoose.connect(DATABASE_URL);
        console.log('\x1b[35m', "MongoDb Connected", '\x1b[0m',);
    } catch (err) {
        console.log('\x1b[31m', `Mongoose Connection Error - ${err.message}`, '\x1b[0m');
    }
};

export default mongooseConnection;