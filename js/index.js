var operation = [];
var currentOp = '';
var currentEntry = '';
var result = '';
var newCalc = true;

function inputNumber(n) {
  if(currentOp != '') {
    operation.push(currentOp);
    currentOp = '';
  } 
  
  if(newCalc) {
    currentEntry = n;
  } 
  else if(currentEntry.length < 12) {
    currentEntry += n;
  }
  
  newCalc = false;
  setEntry(currentEntry);
}
function operator(op) {
  if(currentOp == '') {
    operation.push(currentEntry == '' ? '0' : currentEntry);
    currentEntry = '';
  }

  currentOp = op;

  // set history
  var history = operation.reduce(function(s, current) {
    return s + current + ' ';
  },'') + op;

  if(history.length > 20)
    history = '...' + history.substring(history.length - 20);
  $('#history').html(history);
  setEntry(op);
}
function calculateResult() {
  operation.push(currentEntry);
  // console.log("solve:", operation);

  calculate('X', function(a, b){return a * b;});
  calculate('/', function(a, b){return a / b;});
  calculate('-', function(a, b){return a - b;});
  calculate('+', function(a, b){return a + b;});

  var result = operation[0];
  clearAll();
  currentEntry = result.toString();
  setEntry(currentEntry);
  newCalc = true;
  // console.log(currentEntry);
}
function calculate(op, opFunction) {
  while(operation.indexOf(op) != -1) {
    var i = operation.indexOf(op);
    res = opFunction(parseFloat(operation[i-1]), parseFloat(operation[i+1]));
    operation = operation.slice(0,i-1).concat(res).concat(operation.slice(i+2));
  }
}

function clearAll() {
  currentEntry = '';
  currentOp = '';
  operation = [];
  result = '';
  setEntry('0');
  $('#history').html('');
}
function setEntry(entry) {
  entry = entry.toString();
  if(entry.length > 10)
    entry = entry.substring(0, 10);
  $('#entry').html(entry);
}

function handle(id) {
  // console.log(id, currentEntry, currentOp, operation);
  switch(id) {
    case '0': case '1': case '2': case '3':
    case '4': case '5': case '6': case '7':
    case '8': case '9':
      inputNumber(id);
      break;
    case 'decimal':
      inputNumber('.');
      break;
    case 'plus': 
      operator('+');
      break;
    case 'minus':
      operator('-');
      break;
    case 'times': 
      operator('X');
      break;
    case 'divide':
      operator('/');
      break;
    case 'clear-entry':
      currentEntry = '';
      setEntry('0');
      break;
    case 'clear-all':
      clearAll();
      break;
    case 'enter':
      calculateResult();
      break;
    default:
      break;
           }
}

$(document).ready(function() {
  $('.btn').click(function() {
    var id = $(this).children().get(0).id;
    handle(id);
  });
});