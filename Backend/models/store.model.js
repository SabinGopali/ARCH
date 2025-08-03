  import mongoose from 'mongoose';

  const storeProfileSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    companyDescription: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    street: {
      type: String,
      default: ''
    },
    postCode: {
      type: String,
      default: ''
    },
    openingHours: [{
      day: {
        type: String,
        required: true
      },
      open: {
        type: String,
        required: true
      },
      close: {
        type: String,
        required: true
      },
      enabled: {
        type: Boolean,
        default: true
      }
    }],
    logo: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    }
  }, {
    timestamps: true
  });

  const StoreProfile = mongoose.model('StoreProfile', storeProfileSchema);

  export default StoreProfile;