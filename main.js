var Sealious = require("sealious");
Sealious.init();

require("./field_type.emotion");
require("./cli_channel");

var note = new Sealious.ChipTypes.ResourceType({
	name: "note", 
	fields:[
		{name: "title", type:"text", required: false, params:{max_length:100}},
		{name: "date", type: "datetime", required: true},
		{name: "body", type: "text", required: false},
		{name: "emotion", type: "emotion", required: true}],
	access_strategy: "public"
})
Sealious.start();

var context = new Sealious.Context();
// Sealious.ResourceManager.create(context,"note",{
// 	title: "Tytuł notatki", date: Date.now(), body: "Treść", emotion: "happy"
	
// })

