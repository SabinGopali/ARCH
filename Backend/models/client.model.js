import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
{
    
    client_image: {
        type: String,
        required: true,
    },
   
    company_name: {
        type: String,
        required: true,
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
const Client = mongoose.model('client', clientSchema);

export default Client;