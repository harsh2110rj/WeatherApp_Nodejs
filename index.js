const http = require("http");
const fs = require("fs");
var requests = require("requests");
const homeFile = fs.readFileSync("home.html", "utf-8");
const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempVal%}", (orgVal.main.temp - 273.00).toFixed(2));
    temperature = temperature.replace("{%tempMin%}", (orgVal.main.temp_min - 273.00).toFixed(2));
    temperature = temperature.replace("{%tempMax%}", (orgVal.main.temp_max - 273.00).toFixed(2));
    temperature = temperature.replace("{%country%}", orgVal.name);
    temperature = temperature.replace("{%location%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return temperature;

}
const server = http.createServer((req, res) => {
    if (req.url === "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Muzaffarnagar&appid=296e1f9e7aa1f11b74590d3d834af484")
            .on('data', function (chunk) {
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                console.log(arrData);
                const realTimeData = arrData
                    .map((val) => replaceVal(homeFile, val)).join("");
                res.write(realTimeData);
            })
            .on("end", function (err) {
                if (err) return console.log("connection closed due to errors", err);
                console.log('end');
            })
    }
});
const port = process.env.PORT || 7000;
server.listen(port, '0.0.0.0');