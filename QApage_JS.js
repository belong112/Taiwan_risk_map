let q_index = 0;
let total_score = 0;
let parameterArray = [];

$(document).ready(function() {
   hideDiv('spinner');
   hideDiv('shopDiv');
   hideDiv('resultDiv');
   hideDiv('main-form');
   renderQuestion(0);
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
	const parameters = [1, 1.3, 2.02];
	total_score = parameters[parseInt(parameterArray[0]) + parseInt(parameterArray[1])];
	for (var i = parameterArray.length - 1; i >= 2; i--) {
		total_score *= parameterArray[i];
	}
	total_score = total_score.toFixed(2)

	hideDiv('main-form');
	showDiv('spinner');

	setTimeout(() => {
		hideDiv('spinner');
		document.getElementById("score").innerHTML = total_score;
		showDiv('resultDiv');
		showDiv('shopDiv');
	}, 3000);
}

function handleAddionalFormSubmit() {
	const itemList = [];
	const identity = document.getElementById("identitySelect").value;
	const houseCost = document.getElementById("costInput").value;
	const areaSize = document.getElementById("areaInput").value;
	const houseYear = document.getElementById("yearInput").value;
	if (identity === 3) {
		if (houseYear < 70) {
			return;
		}

		itemList.push(1);
		if (houseCost > 50) {
			itemList.push(2);
		}
	} else {
		if (houseYear <= 90) {
			itemList.push(4);
		}
		if (identity == 2 && areaSize >= 15) {
			itemList.push(5);
		}
		if (houseCost > 50) {
			itemList.push(2);
		}
	}
	console.log(itemList);
	renderIsuranceList(itemList);
	hideDiv('additional-form');
	showDiv('main-form');
}

function renderIsuranceList(itemList) {
	const mainCardLists = itemList.map(item => (
		`<div class="col-sm-12 col-md-4">
			<div class="card m-1" >
		  		<div class="card-body">
		    		<h5 class="card-title">` + insuranceList[item].name + `</h5>
		    		<p class="card-text">` + insuranceList[item].content + `</p>
		  		</div>
			</div>
		</div>`
	));
	const mainCardsDOM = mainCardLists.join('')
	document.getElementById("mainShopList").innerHTML = mainCardsDOM;

	const sublist = [];
	for (var i = 5; i >= 0; i--) {
		if (!itemList.includes(i))
			sublist.push(i);
	}

	const subCardLists = sublist.map(item => (
		`<div class="col-md-4 col-sm-12">
			<div class="card m-1" >
			  	<div class="card-body">
			    	<h5 class="card-title">` + insuranceList[item].name + `</h5>
			    	<p class="card-text">` + insuranceList[item].content + `</p>
			  	</div>
			</div>
		 </div>`
	));

	const subCardsDOM = subCardLists.join('');
	document.getElementById("subShopList").innerHTML = subCardsDOM;
}

function renderQuestion(index) {
	document.getElementById("questionh1").innerHTML = 'Q'+(index+1)+'.';
	document.getElementById("questionh2").innerHTML = Questions[index].question;

	const answerList = Questions[index].anwsers;
	const answerElementList = answerList.map(item => (
		`<label class="my-btn-lg btn col-md-3 col-sm-12 btn-warning" data-toggle="tooltip" data-placement="bottom" title="` + item.content + `">
    			<input type="radio" name="options" value="`+ item.parameter + `">`
    			+ item.text + 
    	`</label>`
	));
	const answerDOM = answerElementList.join('');
	document.getElementById("answerDiv").innerHTML = answerDOM;

	if (index === Questions.length-1) {
		document.getElementById("nextbtn").innerHTML = "提交";
	} else {
	  	document.getElementById("nextbtn").innerHTML = "下一題";
	}

  	if (index === 0) {
  		hideDiv('previousbtn');
  	} else {
  		showDiv('previousbtn');
  	}
}