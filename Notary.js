// Load a book from Disk
function loadBook(filename, displayName) {
  let currentBook = "";
  let url = "Books/" + filename;

  // Reset our UI
  document.getElementById("fileName").innerHTML = displayName;
  document.getElementById("searchstat").innerHTML = "";
  document.getElementById("keyword").value = "";

  // Create a server request to load our book
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.send();

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      currentBook = xhr.responseText;

      getDocStats(currentBook);

      // remove line breaks and carriage returns and replace with a <br>
      currentBook = currentBook.replace(/(\r\n|\r|\n)/g, '<br>');
      document.getElementById("fileContent").innerHTML = currentBook;

      var elmnt = document.getElementById("fileContent");
      elmnt.scrollTop = 0;
    }
  };
}


//get the stats for the books
function getDocStats(fileContent){
  var docLength = document.getElementById("docLength");
  var wordCount = document.getElementById("wordCount");
  var charCount = document.getElementById("charCount");

  let text = fileContent.toLowerCase();
  let wordArray = text.match(/\b\S+\b/g);
  let wordDictionary = {};

  var unCommonWords = [];

  // filter out un Common Words
  unCommonWords = filterStopWords(wordArray);

  //count every word in the wordArray

  for(let word in unCommonWords){
    let wordValue = unCommonWords[word];
    if(wordDictionary[wordValue] > 0){
      wordDictionary[wordValue] += 1;
    }else{
      wordDictionary[wordValue] = 1;
    }
  }
  //sort the array
  let wordList = sortProperties(wordDictionary);

  // return top 5 words
  var top5Words = wordList.slice(0,6);
  var least5Words = wordList.slice(-6,wordList.length);
  // Write the value to the page
  ULTEMPLATE(top5Words,document.getElementById("mostUsed"));

  //return the last 5 words
  ULTEMPLATE(least5Words,document.getElementById("leastUsed"));

  docLength.innerText = "Document Length: " + text.length;
  wordCount.innerText = "Word Count : "+ wordArray.length;
}

function ULTEMPLATE(items,element){
  let rowTemplate = document.getElementById("template-ul-items");
  let templateHTML = rowTemplate.innerHTML;
  let resultsHTML = "";

  for(i = 0;i<items.length-1;i++){
    resultsHTML += templateHTML.replace('{{val}}',items[i][0] + " : " + items[i][1] + "time(s)");

  }
  element.innerHTML = resultsHTML
}

function sortProperties(obj){
  //first convert the object to an array
  let rtnArray = Object.entries(obj);

  //sort the array
  rtnArray.sort(function(first,second){
    return second[1] -first[1];
  })

  return rtnArray
}

// filter out stop words
function filterStopWords(wordArray){
  var commonWords = getStopWords();
  var commonObj = {};
  var uncommonArr = [];
  
  for(i = 0;i<commonWords.length;i++){
    commonObj[commonWords[i].trim()] = true;
  }
  for(i = 0;i<wordArray.length;i++){
    word = wordArray[i].trim().toLowerCase();
    if(!commonObj[word]){
      uncommonArr.push(word);
    }
  }
  return uncommonArr;
}

// list of stop words we don't want to include in stats

function getStopWords(){
  return [ "a", "about","to", "was","his","actually", "almost", "also", "although", "always", "am", "an", "and", "any", "are", "as", "at", "be", "became", "become", "but", "by", "can", "could", "did", "do", "does", "each", "either", "else", "for", "from", "had", "has", "have", "hence", "how", "i", "if", "in", "is", "it", "its", "just", "may", "maybe", "me", "might", "mine", "must", "my", "mine", "must", "my", "neither", "nor", "not", "of", "oh", "ok", "when", "where", "whereas", "wherever", "whenever", "whether", "which", "while", "who", "whom", "whoever", "whose", "why", "will", "with", "within", "without", "would", "yes", "yet", "you", "your","the","he","she", "the"]
}


// mark the words in search
function performMark(){
  //read the keyword
  var keyword = document.getElementById("keyword").value;
  var display = document.getElementById("fileContent");

  var newContent = "";

  //find all the currently markes items

  let spans = document.querySelectorAll("mark");
  //<mark></mark>

  for(var i = 0;i<spans.length;i++){
    spans[i].outerHTML  = spans[i].innerHTML;
  }

  var re = new RegExp(keyword , "gi");
  var replaceText = "<mark id='markme'>$&</mark>"; 
  var bookContent = display.innerHTML;

  // add the mark to the book content  
  newContent = bookContent.replace(re,replaceText);
  
  display.innerHTML = newContent;
  var count = document.querySelectorAll('#markme').length;  // Use the static id
  document.getElementById("searchstat").innerHTML = "Found " +  count + " matches";
  if (count > 0) {
    var element = document.getElementById("markme");
    element.scrollIntoView();
}
  

}

