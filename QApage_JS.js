const Questions = [
	{
		'question':'你尿過幾次床?',
		'anwser1': {
			'text': '1次',
			'parameter': 5,
		},
		'anwser2': {
			'text': '2次',
			'parameter': 3,
		},
		'anwser3': {
			'text': '3次',
			'parameter': 2,
		},
	},
	{
		'question': '你的數學期中幾分?',
		'anwser1': {
			'text': '100',
			'parameter': 3,
		},
		'anwser2': {
			'text': '70',
			'parameter': 2,
		},
		'anwser3': {
			'text': '30',
			'parameter': 1,
		},
	},
	{
		'question': '不要不要?',
		'anwser1': {
			'text': '要',
			'parameter': 10,
		},
		'anwser2': {
			'text': '不要',
			'parameter': 3,
		},
		'anwser3': {
			'text': '要不要ㄋ',
			'parameter': 7,
		},
	},
];

let q_index = 0;
let total_score = 100;

$(document).ready(function() {
   renderQuestion(0);
});

function previousQuestion() {
  	renderQuestion(q_index-=1);
}

function nextQuestion() {
	if (q_index === Questions.length-1)
  	submitanwser();
  else
		renderQuestion(q_index+=1);
}

function submitanwser() {
	alert('100分');
}

function renderQuestion(index) {
	document.getElementById("questionh1").innerHTML = 'Q'+(index+1)+'.';
	document.getElementById("questionh2").innerHTML = Questions[index].question;
	document.getElementById("anwser1").innerHTML = Questions[index].anwser1.text;
	document.getElementById("anwser2").innerHTML = Questions[index].anwser2.text;
	document.getElementById("anwser3").innerHTML = Questions[index].anwser3.text;

	if (index === Questions.length-1) {
		document.getElementById("nextbtn").innerHTML = "提交";
  }
  else {
  	document.getElementById("nextbtn").innerHTML = "下一題";
  }

  if (index === 0) {
  	document.getElementById("previousbtn").style["display"] = "none";
  }
  else {
		document.getElementById("previousbtn").style["display"] = "";
  }
}