const http = require('http');
const url = require('url');

const availableTimes = {
    Monday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Tuesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Wednesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "4:00", "4:30"],
    Thursday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Friday: ["1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
};
const appointments = [
    {name: "James", day: "Wednesday", time: "3:30" },
    {name: "Lillie", day: "Friday", time: "1:00" }];

let serverObj =  http.createServer(function(req,res){
	console.log(req.url);
	let urlObj = url.parse(req.url,true);
	switch (urlObj.pathname) {
		case "/schedule":
			schedule(urlObj.query,res);
			break;
		case "/cancel":
			cancel(urlObj.query,res);
			break;
		case "/check":
 		//added check

			check(urlObj.query,res);
			break;
		default:
			error(res,404,"pathname unknown");

	}
});

function schedule(qObj,res) {
	//check missing data
	if (!qObj.name || !qObj.day || !qObj.time){
		error(res,400, "Missing Data");
		return;
	}
	
	if (availableTimes[qObj.day].some(time => time == qObj.time))
	{
		//display message if time is avalible
		message(res,"scheduled");
		//get index of location to remove it from array
		const tIndex = availableTimes[qObj.day].indexOf(qObj.time);
		//index will be -1 if not there, check if there
		if(tIndex !== -1){
			availableTimes[qObj.day].splice(tIndex,1);
		}
		//add to appointments
		appointments.push(qObj);
	}
	else 
		error(res,400,"Can't schedule");

 
}

function cancel(qObj,res) {
	//check missing data
	if (!qObj.name || !qObj.day || !qObj.time){
		error(res,400, "Missing Data");
		return;
	}
	//get array of appointment if it is there 
	const aIndex = appointments.findIndex(appt => appt.name === qObj.name && appt.day === qObj.day && appt.time === qObj.time);
	//index is -1 if not there
	if (aIndex === -1) {
		error(res, 400, "Appointment not found");
	}
	else{
	//if its there then we remove from appointments and add to avaliabletimes
		appointments.splice(aIndex,1);
		availableTimes[qObj.day].push(qObj.time);
		message(res,"Appointment has been canceled");
		
	}
	//
		
}
//
function check(qObj,res){
	//check if data is missing
	if (!qObj.day || !qObj.time){
		error(res,400, "Missing Data");
		return;
	}
	//if its in the array then its avaliable
	if (availableTimes[qObj.day].some(time => time == qObj.time))
	{
		message(res,"Appointment Avaliable");
	}
	else
	{
		//if its not then its not
		message(res,"Appointment Not Avaliable");
	}
}
//handles error message
function error(response,status,message) {

	response.writeHead(status,{'content-type':'text/plain'});
	response.write(message);
	response.end();
}
//handles other messages
function message(response,textM) {

	response.writeHead(200,{'content-type':'text/plain'});
	response.write(textM);
	response.end();
}

serverObj.listen(80,function(){console.log("listening on port 80")});
