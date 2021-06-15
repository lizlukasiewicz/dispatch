require('dotenv').config()
const express = require('express')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN })
const layouts =require('express-ejs-layouts')
const chalk = require('chalk')
const { parse } = require('dotenv')
let db = require('./models')
const { urlencoded } = require('express')
const methodOverride = require('method-override')

//CONFIG APP
const app = express()
const PORT = process.env.PORT || 5000
app.set('view engine', 'ejs')
app.use(methodOverride('_method'))

//MIDDLEWARES
app.use(layouts)
app.use(express.static(__dirname + `/public`))
app.use(express.urlencoded({ extended:false }))

//  ROUTES

//  GET / ----show a form that lets the user search for a location
app.get('/', (req, res) => {
    res.render('home.ejs')
})

//   GET /SEARCH -- GEOCODE user form data and render a map --(response.body.features[0])maps the center of the city
app.get('/search', (req, res) => {
    geocodingClient.forwardGeocode({
        query: `${req.query.city}, ${req.query.state}`
    })
    .send()
    .then(response => {
        //console.log(response.body.features[0])
        res.render('show.ejs', {
            match: response.body.features[0],
            mapkey: process.env.MAPBOX_TOKEN
        })
    })
})
//GET polygon lat/lon coordinates array, and id #
app.get('/zone', (req, res) => {
    const lnglat = req.headers.lnglat.split(",").map(num => parseFloat(num))
    console.log(lnglat)
    res.json({message: 'hello from the route'})
})
// app.get('show.ejs', (req, res) => {
// })
    //get zone name
    //store zone data in model table

//POST - zone data with input name 

//PUT (UPDATE) longitude/latitude coordinates 
    //change the updataArea function in 'draw.update'

     app.use('/customers', require('./controllers/customers'))
    

    app.listen(PORT, () => console.log(chalk.bold.rgb(10,100,200)`smooth sounds of port ${PORT}🗺`))

// console.log(chalk`{bold.rgb(10,100,200) Hello!}`)
// console.log(chalk.bold.rgb(10, 100, 200)('Hello!'));
// console.log(chalk.bold.rgb(10, 100, 200)`Hello!`)
//chalk.bgKeyword('orange')('Some orange text'