//click event for schedule
document.getElementById("schedule").addEventListener("click",schedule);
function schedule()
{
	//getting values from textboxes
	let name = document.getElementById('name').value;
	let day = document.getElementById('day').value;
	let time = document.getElementById('Time').value;

	//setting up the url
	let url = `/schedule?name=${name}&day=${day}&time=${time}`;
	let xmlhttp = new XMLHttpRequest();

	//Starting and opening xml
	xmlhttp.onload = loadResults;
	xmlhttp.onerror = loadError;

	xmlhttp.open('GET', url);
	xmlhttp.send();

	//loading results into results html 
	function loadResults() {
		document.getElementById('results').innerHTML = xmlhttp.responseText;
	}

	function loadError() {
	  document.getElementById('results').innerHTML = 'Request failed.';
	}
}

//click event for cancel
document.getElementById("cancel").addEventListener("click",cancel);
function cancel()
{
	//getting values from textboxes
	let name = document.getElementById('name').value;
	let day = document.getElementById('day').value;
	let time = document.getElementById('Time').value;

	//setting up url
	let url = `/cancel?name=${name}&day=${day}&time=${time}`;
	let xmlhttp = new XMLHttpRequest();

	//Starting and opening xml
	xmlhttp.onload = loadResults;
	xmlhttp.onerror = loadError;

	xmlhttp.open('GET', url, true);
	xmlhttp.send();

	//loading results into results html 
	function loadResults() {
		document.getElementById('results').innerHTML = xmlhttp.responseText;
	}

	function loadError() {
	  document.getElementById('results').innerHTML = 'Request failed.';
	}
}

//click event for check
document.getElementById("check").addEventListener("click",check);
function check()
{
	//getting values from textboxes
	let name = document.getElementById('name').value;
	let day = document.getElementById('day').value;
	let time = document.getElementById('Time').value;

	//setting up url
	let url = `/check?day=${day}&time=${time}`;
	let xmlhttp = new XMLHttpRequest();

	//Starting and opening xml
	xmlhttp.onload = loadResults;
	xmlhttp.onerror = loadError;

	xmlhttp.open('GET', url, true);
	xmlhttp.send();

	//loading results into results html 
	function loadResults() {
		document.getElementById('results').innerHTML = xmlhttp.responseText;
	}

	function loadError() {
	  document.getElementById('results').innerHTML = 'Request failed.';
	}
}
