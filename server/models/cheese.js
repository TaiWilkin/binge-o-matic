import mongoose from 'mongoose';
const cheeseSchema = new mongoose.Schema({
	name: {type: String, required: true},
	img: {type: String}
})

export default mongoose.model('Cheese', cheeseSchema);