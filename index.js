var http = require('http')
, url = require('url')
, fs = require('fs')
, server;
var crypto = require('crypto');

// Create the routes object
console.log("Starting Griphos Node.js Server...");
var routes = {};
console.log("Waiting for requests...");

routes["create-route"] = function (req, res) {
    fs.readFile(__dirname + '/create-route.html', function (err, data) {
        if (err) throw err;
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data, 'utf8');
        res.end();
    });
};


// Define the go-to-created-route (executes on button-click after user input)
routes["go-to-the-created-route"] = function (req, res) {


// Get the request url and split it to get the inputted value
var reqPath = req.url;
var splitPath = reqPath.split("=");
var routeName = splitPath[(splitPath.length - 1)]; // outputs the value entered into text input
var routeNameMD5  = crypto.createHash('md5').update(routeName).digest('hex');


// Uncomment this if you want to see the MD5 upon creation (Note: it gets dislpayed later anyhow)
// console.log(routeNameMD5);


// Create the new route by passing in the value of routeNameMD5, and display a page
routes[routeNameMD5] = function (req, res) {

    console.log("Accessing user page: " + routeNameMD5);
    var body = "<html>" + 
        "<head>" +
        "<meta http-equiv='Content-Type' content='text/html'" +
        "charset=UTF-8 />" +
        "</head>" +
        "<body>" +
        "<p>Page created:    " + routeNameMD5 + "</p>" +
        "</body>" +
        "</html>";
     res.writeHead(200, {"Content-Type": "text/html"});
     res.write(body);
     res.end();
};

// Navigate to the newly created page (after hitting submit button)
res.writeHead(302,{
    'Location': routeNameMD5
});
res.end();


};


// Function for sending a 404 error response
function send404(request, response) {
    response.writeHead(404);
    response.write("<p><i>...let the games begin.</i></p><br>");
    response.end();
}


// Continue Main Execution: declare the server object
server = http.createServer(function(req,res){

    // Parse the pathname as a url, get the trimmed route from the request
    var path = url.parse(req.url).pathname;
    var pathArr = path.split('/');

    // If there is no trailing "/something", then route to create-route.html
    // Otherwise, check to see if requested URL exists in routes array
    // And if not, then send a 404 message
    if (pathArr[1].length == 0) {
        routes["create-route"](req,res);
    } else if (routes.hasOwnProperty(pathArr[1])) {
        routes[pathArr[1]](req, res);
    } else {
        send404(req,res);
    }
});

// Continue Main Execution: start the actual server
server.listen(8080);
