const fs = require('fs')
let jsonData = JSON.parse(fs.readFileSync('./src/assets/sintef_db.json', 'utf-8'))

jsonData.sensors.names = jsonData.sensors.map(e => {
    return Object.keys(e)[0]
})

let newJson =


/* console.log(jsonData.sensors.names); */


// convert JSON object to string
const data = JSON.stringify(jsonData.sensors.names);

console.log(data);

// write JSON string to a file
fs.writeFile('test.json', data, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data is saved.");
});