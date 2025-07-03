import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
{
    
    position: {
        type: String,
        required: true,
    },
   
    vacancies: {
        type: Number,
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
const Career = mongoose.model('Career', careerSchema);

export default Career;