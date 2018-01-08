var mongoose =	require('mongoose');
var Schema = mongoose.Schema;
var hospitalSchema = new Schema({
    name: {	
        type: String,	
        required: [true, 'The field is required']	
    },
    img: {	
        type: String,	
        required: false 
    },
    user: {	
        type: Schema.Types.ObjectId,
        ref: 'user' 
    }
},{	collection: 'hospitals' });

module.exports = mongoose.model('Hospital',	hospitalSchema);