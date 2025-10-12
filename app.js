const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

//appointment array
const availableTimes = {
    Monday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Tuesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Wednesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "4:00", "4:30"],
    Thursday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Friday: ["1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
};

//current appointments
const appointments = [
    { name: "James", day: "Wednesday", time: "3:30" },
    { name: "Lillie", day: "Friday", time: "1:00" }
];

// error() to replace res when its an error
function error(response, status, textM) {
    response.writeHead(status, { 'Content-Type': 'text/plain' });
    response.write(textM);
    response.end();
}

// message() to replace res
function message(response, textM) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.write(textM);
    response.end();
}

function schedule(qObj, res) {
	 //check missing data
    if (!qObj.name || !qObj.day || !qObj.time) {
        error(res, 400, "Missing Data");
        return;
    }

    if (availableTimes[qObj.day].some(time => time == qObj.time)) {
         //display message if time is avalible
		message(res, "Scheduled successfully");
         //get index of location to remove it from array
		const tIndex = availableTimes[qObj.day].indexOf(qObj.time);
        //index will be -1 if not there, check if there
		if (tIndex !== -1) availableTimes[qObj.day].splice(tIndex, 1);
        //add to appointments
		appointments.push(qObj);
    } else {
        error(res, 400, "Can't schedule: time unavailable");
    }
}

function cancel(qObj, res) {
	 //check missing data
    if (!qObj.name || !qObj.day || !qObj.time) {
        error(res, 400, "Missing Data");
        return;
    }

    const aIndex = appointments.findIndex(
        appt => appt.name === qObj.name && appt.day === qObj.day && appt.time === qObj.time
    );
	//index is -1 if not there
    if (aIndex === -1) {
        error(res, 400, "Appointment not found");
    } else {
		//if its there then we remove from appointments and add to avaliabletimes
        appointments.splice(aIndex, 1);
        availableTimes[qObj.day].push(qObj.time);
        message(res, "Appointment canceled");
    }
}

function check(qObj, res) {
	//check if data is missing
    if (!qObj.day || !qObj.time) {
        error(res, 400, "Missing Data");
        return;
    }
	
	//if its in the array then its avaliable
    if (availableTimes[qObj.day]?.includes(qObj.time)) {
        message(res, "Appointment Available");
    } else {
		//if its not then its not
        message(res, "Appointment Not Available");
    }
}

//using path.ext to get type and return to send
function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.txt': return 'text/plain';
        case '.html': return 'text/html';
        case '.css': return 'text/css';
        case '.js': return 'application/javascript';
        case '.json': return 'application/json';
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.gif': return 'image/gif';
        case '.png': return 'image/png';
        default: return 'application/octet-stream';
    }
}

//sends files based on type
function sendFile(filePath, res) {
    fs.readFile(filePath, function (err, data) {
        if (err) {
			//error if not found
            error(res, 404, 'Error 404: resource not found.');
        } else {
			//send file if found
            res.writeHead(200, { 'Content-Type': getContentType(filePath) });
            res.write(data);
            res.end();
        }
    });
}

// Main request handler with routing
function serveStatic(req, res) {
    const urlObj = url.parse(req.url, true);
    const pathname = urlObj.pathname;

	//log paths
    console.log("Request:", pathname);

	//switch for paths
    switch (pathname) {
        case "/schedule":
            schedule(urlObj.query, res);
            break;

        case "/cancel":
            cancel(urlObj.query, res);
            break;

        case "/check":
            check(urlObj.query, res);
            break;
			
        case "/":
        case "/index":
        case "/index.html":
            sendFile('./public_html/index.html', res);
            break;

        default:
            // send files (added join since js not working with html)
            const fileName = path.join(__dirname, 'public_html', pathname);
            sendFile(fileName, res);
            break;
    }
}

//Create and start server
http.createServer(serveStatic).listen(80, function() {
    console.log("listening on port 80");
});
