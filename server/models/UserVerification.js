import mongoose from "mongoose";

const Schema = mongoose.Schema;
const UserVerificationSchema = new Schema(
    {
        userId: String,
        uniqueString: String,
        createdAt: Date,
        expiresAt: Date,
    }, { timestamps: true }
);

const UserVerification = mongoose.model('UserVerification', UserVerificationSchema);
export default UserVerification;