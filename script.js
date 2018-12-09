

var messages = [],
	messagesG = [], //array that hold the record of each string in chat
  lastUserMessage = "", //keeps track of the most recent input string from the user
  botMessage = "", //var keeps track of what the chatbot is going to say
  botName = 'Chatbot', //name of the chatbot
  talking = true; //when false the speach function doesn't work



//edit this function to change what the chatbot says
function chatbotResponse() {
  talking = true;
  botMessage = "I'm confused"; //the default message
  lastUserMessage = lastUserMessage.replace(/ +/g, "%20");
 fetch("https://acobot-brainshop-ai-v1.p.mashape.com/get?bid=178&key=sX5A2PcYZbsN5EY6&uid=mashape&msg="+lastUserMessage, {
  headers: {
    	Accept: "application/json",
   	"X-Mashape-Key": "XTAJ1AQfbzmshw3qVeLKUuRLLEUap19S13hjsnn3Dv62dSd9VA"
  }
})
.then((resp)=>resp.json())
.then(function(data){
	let authors = data;
	botMessage = authors.cnt;
	//add the chatbot's name and message to the array messages

	botMessage = botMessage.replace("Valiant,","");
	botMessage = botMessage.replace("  ","");
	botMessage = botMessage.replace(", Valiant!","");
	botMessage = botMessage.replace("Valiant","");


		//sentiment analysis
		fetch("https://text-sentiment.p.mashape.com/analyze", {
		  body: "text="+botMessage,
		  headers: {
			Accept: "application/json",
			"Content-Type": "application/x-www-form-urlencoded",
			"X-Mashape-Key": "XTAJ1AQfbzmshw3qVeLKUuRLLEUap19S13hjsnn3Dv62dSd9VA"
		  },
		  method: "POST"
		})
		.then((resp)=>resp.json())
		.then(function(data){
			let authors = data;
			var emo ="";
			if (authors.pos_percent != "0%" )
					emo = emo+" &#x1F600;";
			
			if (authors.mid_percent != "0%")
					emo = emo+ " &#x1F914;";
			
			if (authors.neg_percent != "0%")
					emo = emo+ " &#x1F61F;";
			
			messages.push("<b>" + botName + ":</b> " + botMessage +emo);
			//Great. Then, may I ask you some questions? -> 50% pos + 50% mid
				// says the message using the text to speech function written below
				//text to Speech
				//https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API

				if ('speechSynthesis' in window && talking) 
				{
				var utterance = new SpeechSynthesisUtterance(botMessage);
				speechSynthesis.speak(utterance);
				}
			//outputs the last few array elements of messages to html
			for (var i = 1; i < 100; i++) {
			  if (messages[messages.length - i])
				document.getElementById("chatlog" + i).innerHTML = messages[messages.length - i];
			}
			})
		.catch(function(error){
		console.log(JSON.stringify(error));
		});




	
	})
.catch(function(error){
console.log(JSON.stringify(error));
});

}


//edit this function to change what the chatbot says
function correctMsg() {

  botMessage = "I'm confused"; //the default message

fetch("https://dnaber-languagetool.p.mashape.com/v2/check", {
  body: "language=en-US&text="+lastUserMessage,
  headers: {
    Accept: "text/plain",
    "Content-Type": "application/x-www-form-urlencoded",
    "X-Mashape-Key": "XTAJ1AQfbzmshw3qVeLKUuRLLEUap19S13hjsnn3Dv62dSd9VA"
  },
  method: "POST"
})
.then((resp)=>resp.json())
.then(function(data){
	let authors = data;
	if (authors.matches.length==0)
	{
		messagesG.push("<b> message :</b> " +lastUserMessage+" is correct");
		for (var i = 1; i < 100; i++) 
			{
			  if (messagesG[messagesG.length - i])
				document.getElementById("chatlo" + i).innerHTML = messagesG[messagesG.length - i];
			}
	}
	else
	{
		for(var i = 0; i < authors.matches.length; i++)
		{ 	botMessageG = "";
			botMessage = authors.matches[i].message;
			
			for(var j = 0; j < authors.matches[i].replacements.length; j++)
			{
				botMessageG = botMessageG +" "+authors.matches[i].replacements[j].value;
			}
			messagesG.push("<b> Message :</b> " +botMessage+ "<b>  Replacements :</b> " + botMessageG);
		}
		for (var i = 1; i < 100; i++) 
				{
				  if (messagesG[messagesG.length - i])
					document.getElementById("chatlo" + i).innerHTML = messagesG[messagesG.length - i];
				}
	}
	})
.catch(function(error){
console.log(JSON.stringify(error));
});

}

//this runs each time enter is pressed.
//It controls the overall input and output
function newEntry() {
  //if the message from the user isn't empty then run 
  if (document.getElementById("boitedisc").value != "") {
    //pulls the value from the chatbox ands sets it to lastUserMessage
    lastUserMessage = document.getElementById("boitedisc").value;
    //sets the chat box to be clear
    document.getElementById("boitedisc").value = "";
    //adds the value of the chatbox to the array messages
    messages.push(lastUserMessage);
    //Speech(lastUserMessage);  //says what the user typed outloud
    //sets the variable botMessage in response to lastUserMessage
    chatbotResponse();

  }
    //if the message from the user isn't empty then run 
  if (document.getElementById("boitedisc1").value != "") {
	 
    //pulls the value from the chatbox ands sets it to lastUserMessage
    lastUserMessage = document.getElementById("boitedisc1").value;
    //sets the chat box to be clear
    document.getElementById("boitedisc1").value = "";
    //sets the variable botMessage in response to lastUserMessage
    correctMsg();

  }
}



//runs the keypress() function when a key is pressed
document.onkeypress = keyPress;
//if the key pressed is 'enter' runs the function newEntry()
function keyPress(e) {
  var x = e || window.event;
  var key = (x.keyCode || x.which);
  if (key == 13 || key == 3) {
    //runs this function when enter is pressed
    newEntry();
  }
  if (key == 38) {
    console.log('hi')
      //document.getElementById("boitedisc").value = lastUserMessage;
  }
}

//clears the placeholder text ion the chatbox
//this function is set to run when the users brings focus to the chatbox, by clicking on it
function placeHolder() {
  document.getElementById("boitedisc").placeholder = "";
}
function placeHolder1() {
  document.getElementById("boitedisc1").placeholder = "";
}
