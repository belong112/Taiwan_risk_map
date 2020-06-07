let q_index = 0;
let total_score = 100;
let parameterArray = [];

$(document).ready(function() {
   renderQuestion(0);
   hideDiv('spinner');
   hideDiv('shopDiv');
});

function showDiv(elementId) {
    document.getElementById(elementId).style["display"] = "";
}

function hideDiv(elementId) {
    document.getElementById(elementId).style["display"] = "none";
}

function previousQuestion() {
	parameterArray.pop();
	$("input[name='options']:checked").parent().removeClass("active"); 	

  renderQuestion(q_index-=1);
}

function nextQuestion() {
	if ($("input[name='options']:checked").length === 0) {
		alert('請選擇一個答案優!');
		return;
	}

	parameterArray.push($("input[name='options']:checked").val());
	$("input[name='options']:checked").parent().removeClass("active"); 	

	if (q_index === Questions.length-1)
  	submitanwser();
  else
		renderQuestion(q_index+=1);
}

function submitanwser() {
	for (var i = parameterArray.length - 1; i >= 0; i--) {
		total_score *= parameterArray[i];
	}

	hideDiv('anwser1');
	hideDiv('anwser2');
	hideDiv('anwser3');
	hideDiv('previousbtn');
	hideDiv('nextbtn');
	showDiv('spinner');
	document.getElementById("questionh1").innerHTML = '';
	document.getElementById("questionh2").innerHTML = '';

	setTimeout(() => {
		hideDiv('spinner');
		document.getElementById("questionh1").innerHTML = '你的風險係數值為';
		document.getElementById("questionh2").innerHTML = total_score;
		showDiv('shopDiv');
	}, 3000);
}

function renderQuestion(index) {
	document.getElementById("questionh1").innerHTML = 'Q'+(index+1)+'.';
	document.getElementById("questionh2").innerHTML = Questions[index].question;
	document.getElementById("anwser1").innerHTML = ('<input type="radio" name="options" autocomplete="off" value="'+ Questions[index].anwser1.parameter + '">' + Questions[index].anwser1.text);
	document.getElementById("anwser2").innerHTML = ('<input type="radio" name="options" autocomplete="off" value="'+ Questions[index].anwser2.parameter + '">' + Questions[index].anwser2.text);
	document.getElementById("anwser3").innerHTML = ('<input type="radio" name="options" autocomplete="off" value="'+ Questions[index].anwser3.parameter + '">' + Questions[index].anwser3.text);

	if (index === Questions.length-1) {
		document.getElementById("nextbtn").innerHTML = "提交";
  }
  else {
  	document.getElementById("nextbtn").innerHTML = "下一題";
  }

  if (index === 0) {
  	hideDiv('previousbtn');
  }
  else {
  	showDiv('previousbtn');
  }
}