var Sealious = require("sealious");

var field_type_emotion = new Sealious.ChipTypes.FieldType("emotion");

field_type_emotion.prototype.isProperValue = function(context,value){

	var emotions = ["sad","angry","happy","none"]
	if (emotions.indexOf(value)> -1 ) return true
		else return false
}