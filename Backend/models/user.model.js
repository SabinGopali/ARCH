    import mongoose from "mongoose";

    const userSchema = new mongoose.Schema({
        username: {
            type: String,
            required: true,
            unique: true,
        },
        company_name: {
            type: String,
            required: function () {
                return this.isSupplier === true;
            },
        },
        company_location: {
            type: String,
            required: function () {
                return this.isSupplier === true;
            },
        },
        phone: {
            type: String,
            required: function () {
                return this.isSupplier === true;
            },
        },
        businessTypes: {
        type: [String], // array of string values
        enum: [
            "Export Internationally",
            "Online Store",
            "Wholesale Supplier",
            "Manufacturer",
        ],
        default: [],
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: String,
            default: function () {
            const seed = Math.random().toString(36).substring(2, 15);
            return `https://avatars.dicebear.com/api/avataaars/${seed}.svg`;
        },
        },
        deletionRequested: {
            type: Boolean,
            default: false,
            },
        deletionReason: {
            type: String,
            default: "",
            },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isSupplier: {
            type: Boolean,
            default: false,
        },
        // Email verification fields
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationOtp: {
            type: String,
            default: null,
        },
        emailVerificationOtpExpiresAt: {
            type: Date,
            default: null,
        },
            }, 
            {timestamps:true}
            );

    const User = mongoose.model('User', userSchema);

    export default User;