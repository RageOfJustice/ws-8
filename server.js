const express = require('express')
const request = require('request')
const app = express()

let token = ''

const weatherkey = '8f66ff42df834972b7372707180607'

let weather = ''

app.get('/', (req, res) => {
  res.send(
    `token is ${JSON.stringify(token)} \n weater is  ${JSON.stringify(
      weather,
    )}`,
  )
})

app.get('/login', function(req, res, next) {
  res.redirect(
    'https://oauth.vk.com/authorize?client_id=6625518&redirect_uri=http://localhost:80/auth&response_type=code&scope=notes&v=5.80',
  )
})

let secondPhase = false
app.get('/auth', (req, res, next) => {
  const { code } = req.query
  console.log(req.query)
  if (secondPhase) {
    res.redirect('/')
  } else {
    secondPhase = true
    request(
      `https://oauth.vk.com/access_token?client_id=6625518&redirect_uri=http://localhost:80/auth&client_secret=g2rOiMOWOl28o8cNkAbC&code=${code}&v=5.80`,
      (err, response, body) => {
        console.log(err, response.statusCode)
        if (!err && response.statusCode == 200) {
          console.log(body)
          token = JSON.parse(body)
        }
      },
    )
  }
})

app.get('/action', (req, res) => {
  console.log(token.access_token)
  request(
    `https://api.apixu.com/v1/current.json?key=${weatherkey}&q=Krasnodar`,
    (err, response, body) => {
      if (!err && response.statusCode === 200) {
        weather = JSON.parse(body)
        request(
          `https://api.vk.com/method/notes.add?title=${new Date()}&text=${
            weather.current.condition.text
          }&access_token=${token.access_token}&v=5.80`,
          (err, response, body) => {
            console.log(err, body)
            res.redirect('/')
          },
        )
      }
    },
  )
})

app.listen(80, function() {
  console.log('Example app listening on port 3000!')
})
