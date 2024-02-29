import mongoose from "mongoose";

const Schema = mongoose.Schema;
const UserSchema = new Schema(
    {
        userId: {
            type: String,
        },
        googleId: {
            type: String,
        },
        facebookId: {
            type: String,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            min: 2,
            max: 50,
        },
        firstName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        lastName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        email: {
            type: String,
            required: true,
            min: 2,
            max: 50,
            unique: true
        },
        password: {
            type: String,
            required: true,
            min: 5,
        },
        picturePath : {
            type: String,
            default: '',
        },
        location: String,
        occupation: String,
        viewedProfile: Number,
        impressions: Number,
        verified: Boolean,
        

    }, { timestamps: true }
);

const User = mongoose.model('User', UserSchema);
export default User;