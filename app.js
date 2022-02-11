const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

const apiKey = '*******************';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {weather: null, error: null});
})

app.post('/', (req, res) => {
  let city = req.body.city;
  let api = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

  request(api, (err, response, body) => {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again!'});
    } else {
      let weather = JSON.parse(body);
      if(weather.name == undefined){
        res.render('index', {weather: null, error: 'Please enter a valid city name!'});
      } else {
        let date=new Date();
        let today="Date: " + date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() + "\t" + "Time: " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        let name=`City Name: ${weather.name}`;
        let temp = `Temperature: ${weather.main.temp} degrees`;
        let condition = `Condition: ${weather.weather[0].main} - ${weather.weather[0].description}`;
        let humidity = `Humidity: ${weather.main.humidity}%`;
        let wind = `Wind: ${Math.round((weather.wind.speed)*3.6*100)/100} km/hr`;
        res.render('index', {today:today, condition:condition, weather:name, temp:temp, humidity:humidity, wind:wind, error: null});
      }
    }
  });
})

const port = process.env.PORT || '5000';
app.listen(port, () => {
  console.log(`Server is live and listening to requests on port ${port}!`);
})
