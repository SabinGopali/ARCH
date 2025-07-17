import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
{
    
    fullname: {
        type: String,
        required: true,
    },
   
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    exisiting_website: {
        type: String,
        required: true,
    },
    service_select: {
        type: String,
        required: true,
        enum: ["Developer", "Designer", "Manager", "CEO", "CTO"],
    },
    description: {
        type: String,
        required: true,
    },
    userRef: {
        type: String,
        required: true,
    },
    userMail: {
        type: String,
        required: true,
    },
    
},
{timestamps: true}

)
const form = mongoose.model('form', formSchema);

export default form;