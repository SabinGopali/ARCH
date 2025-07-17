import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
{
    
    c_logo: {
        type: String,
        required: true,
    },
   
    c_name: {
        type: String,
        required: true,
    },
    c_description: {
        type: String,
        required: true,
    },
    c_link: {
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
const Partner = mongoose.model('Partners', partnerSchema);

export default Partner;