import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
{
    
    s_title: {
        type: String,
        required: true,
    },
   
    s_description: {
        type: String,
        required: true,
    },
    s_link: {
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
const Service = mongoose.model('services', serviceSchema);

export default Service;