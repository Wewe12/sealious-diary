var Sealious = require("sealious");
var readline = require("readline");


var CliChannel = new Sealious.ChipTypes.Channel("cli");

CliChannel.start = function(){
	console.log("Welcome to Sealious CLI Channel. Your wish is my command.");
	console.log("Please enter your wish:");
	console.log("To create a note enter 'emotion' 'title' 'note body'");
	var rl = readline.createInterface({
	  input: process.stdin,
	});

	function process_line(line){
		var words = line.split(" ");
		switch(words[0]){
			case "list":
				var resource_type_name = words[1];
				var context = new Sealious.Context();
				Sealious.ResourceManager.list_by_type(context, resource_type_name)
				.then(function(list){
					console.log(list);
				})
				break;
			case "create":
				var note = {};
				note.date = Date.now();
				note.emotion= words[1];
				if(words[2]){
					note.title = words[2];
					if(words[3]) note.body = words[3];
				} 
				var context = new Sealious.Context();
				console.log(note);
				Sealious.ResourceManager.create(context,"note", note).catch(function(error){
					console.error(error);
				});	
				break;

		}
	}

	rl.on("line", process_line);

}