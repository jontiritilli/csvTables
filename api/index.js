const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000;
const csvUrl = "https://docs.google.com/spreadsheets/d/1FRonP_omhMxrO8Gp67uAEultrYdPQwk90W6LUzryP5s/gviz/tq?&tqx:out=csv";

const app = express();

// app.use(bodyParser.json());
function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}

app.get('/csv', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  const response = await axios.get(csvUrl);
  //clean up the response from google so we can parse it
  var from = response.data.indexOf("{");
  var to   = response.data.lastIndexOf("}")+1;
  var jsonText = response.data.slice(from, to);
  // parse it
  const json = JSON.parse(jsonText)
  //convert to usable table information
  // cols and rows.
  // cols are keys, rows are data
  // for each row, take the data at i and build a new object out of it
  var rows = json.table.rows.map(row => { return row.c.map((item, i) => item ? item.v : null )})
  var keys = json.table.cols.map(item => item.label);
  var objects = rows.map(function(values) {
      return keys.reduce(function(o, k, i) {
          o[camelize(k)] = values[i];
          return o;
      }, {});
  });
  res.json(objects);
})

app.listen(PORT, () => {
  console.log(`Application running on port: ${PORT}`)
})