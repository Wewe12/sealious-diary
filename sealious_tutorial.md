Kartka z pamiętnika - prosta aplikacja z użyciem Sealiousa
====
###Pisanie kodu
W tym tutorialu zostanie stworzona prosta aplikacja Sealiousowa. Będzie to notatka do pamiętnika. Użytkownik będzie wpisywał w wierszu poleceń jak się czuje, tytuł i treść a program będzie przechowywał ten wpis w bazie danych. 

W celu rozpoczęcia pracy należy stworzyć plik w js. np.  main.js Informacje dotyczące konfiguracji i instalacji Sealiousa zamieszczone są w drugiej sekcji tutoriala.
W nagłowku misimy podłączyć pakiet Sealiousa za pomocą:
```js
	var Sealious = require("sealious");
```
a także wywołać metode:
```js
	Sealious.init();
```

Następnie tworzymy prosty Chip. W naszym prypadku będzie to ResourceType.
```js
	var note = new Sealious.ChipTypes.ResourceType({
	name: "note", 
	fields:[
		{name: "title", type:"text", required: false, params:{max_length:100}},
		{name: "date", type: "datetime", required: true},
		{name: "body", type: "text", required: false},
		{name: "emotion", type: "emotion", required: true}],
	access_strategy: "public"
})

```
[Chip](https://github.com/Sealious/Sealious/blob/dev/README.md) ten definiuje notatkę z pamiętnika. Zawiera ona pola: tytuł, data, treść właściwa i emocje. Przyjęliśmy, że pola data i emocje są wymagane. Definiujemy również strategie dostępu. 

Ponieważ pole emocja jest typu emocja, musimy określić ten typ. W tym celu musimy stworzyć nowego field_type. Tworzymy plik field_type.js o treści: 

```js
	var Sealious = require("sealious");
	
	var field_type_emotion = new Sealious.ChipTypes.FieldType("emotion");

	field_type_emotion.prototype.isProperValue = function(context,value){

	var emotions = ["sad","angry","happy","none"]
	if (emotions.indexOf(value)> -1 ) return true
		else return false
}

```
Pierwsza linijka załącza pakiet Sealiousa do naszego pliku. W kolejnej linijce wywołujemy konstruktor chipa o typie FieldType. Następnie definiujemy funkcje, która gwarantuje nam, że nasze pole typu emocja przyjmie tylko jedną z wartości: sad, angry, happy, none.

Aby móc się komunikować z naszą aplikacją potrzebujemy kanał dostępu. W naszym przypadku będzie to prosty kanał konsolowy. W tym celu tworzymy nowy plik o nazwie cli_channel.js
Na początek załączamy pakiety Sealiousa i readline, który umożliwi nam zczytywanie z konsoli.
```js
	var Sealious = require("sealious");
	var readline = require("readline");
```
Następnie wywołujemy konstruktor kanału:
```js
	var CliChannel = new Sealious.ChipTypes.Channel("cli");
```
Po czym definiujemy sposób komunikacji z konsolą.
```js
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

```
Pierwsza funkcja wywołuje nam ekran powitalny na konsoli. Następnie tworzony jest interfejs, dzięki któremu będzie możliwe czytanie ze standardowego wejścia. Funkcja proces_line analizuje linie podaną przez użytkownika. Po wpisaniu komendy list note wyświetli na ekranie w formie listy wszystkie zapisane notatki. Gdy wpiszemy create zosają sprawdzone kolejne słowa z podanej linijki i odpowiednio w kolenosci emocja, tytuł, treść zostają umieszczone w bazie danych.

Baza danych zostaje stworzona automatycznie. Użytkownik nie musi jej tworzyć ręcznie, jeżeli nie zależy mu na konkretnej bazie danych.

Aby nasze pliki field_type_emotion.js i cli_channel.js były dostępne w pliku main.js musimy po Sealious.init() dodać:
```js
	require("./field_type.emotion");
	require("./cli_channel");

``` 
Nie przypisujemy ścieżki do żadnej zmiennej, ponieważ nie potrzebujemy odwoływać się do tych plików w kodzie. 

Aby uruchomić naszą aplikacje na końcu w pliku main.js należy wywołać metodę:
```js
	Sealious.start()
``` 
###Instalacja i uruchomienie
W celu uruchomienia naszej aplikacji potrzebujemy npm. Możemy pobrać go ze strony: [link](https://nodejs.org/en/)
Po zaintsalowaniu plików należy otworzyć wiersz poleceń/konsole i zainicjalizować go wpisując komende:
```
	npm init
```
W katalogu z naszymi plikami js stworzy się nowy plik package.json.

Następnie instalujemy Sealiousa wpisujac:
```
	npm install --save sealious
```
W celu uruchomienia programu, musimy przejść w konsoli do lokalizacji, w której jest nasz plik startowy u nas main.js i wpisać:
```
	node main.js 
```
lub
```
	node .
```
w drugim przypadku zostanie uruchomiony domyślny plik startowy. 