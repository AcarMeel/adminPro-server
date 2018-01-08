var mongoose =	require('mongoose');
var Schema =	mongoose.Schema;

var doctorSchema =	new Schema({
    nombre: {	type: String,	required: [true,	'El	nombre	es	necesario']	},
    img: {	type: String,	required: false },
    usuario: {	type: Schema.Types.ObjectId,	ref: 'Usuario',	required: true },
    hospital: {	type: Schema.Types.ObjectId,	ref: 'Hospital',	
    required: [true,'The field is required']}
});
module.exports =	mongoose.model('Medico',	doctorSchema);