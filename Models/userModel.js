import Mongoose from "mongoose";
import moment from "moment";

const userSchema = new Mongoose.Schema({
    name: { type: String, required: true },

    email: {
        type: String, required: true, unique: true,
        validate: {
            validator: emailExample => {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailExample);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },

    mobileNumber: { type: String, required: true, trim: true, },

    password: { type: String, required: true, },

    role: {
        type: String,
        enum: ["User", "Proffesional"],
        default: "User",
    },

    registrationDate: {
        type: Date,
        default: Date.now()
    },
    searchHistories: [
        {
            search: {
                type: String,
                required: true
            },
            time: {
                type: Date,
                default: Date.now()
            }
        }
    ]
});

const userModel = Mongoose.model('User', userSchema);

export default userModel;
