//====================================================================================================
// Imports
//====================================================================================================
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

//====================================================================================================
// Order model
//====================================================================================================

const orderSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    restaurantId: {
        type: String,
        required: true,
    },
    //By reference so updates do not make us update each product individually.
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        default: [],
    }],
    status: {
        type: String,
        default: "pending"
    },
    createdAt: {
        type: String,
        default: () => new Date().toISOString()
    }
});


export const Order = mongoose.model('Order', orderSchema);

