import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
{
    
    t_image: {
        type: String,
        required: true,
    },
   
    Username: {
        type: String,
        required: true,
    },
    t_post: {
        type: String,
        required: true,
    },
    t_description: {
        type: String,
        required: true,
    },
    t_fblink: {
        type: String,
        required: true,
    },
    t_lnlink: {
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
const team = mongoose.model('team', teamSchema);

export default team;