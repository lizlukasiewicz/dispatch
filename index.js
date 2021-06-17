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
// let router = express.Router()

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
app.get('/mapzone', (req, res) => {
    res.render('mapzone.ejs')
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
            mapkey: process.env.MAPBOX_TOKEN,
            customer: undefined,
            coordinates: [null, null]
        })
    })
})
//GET polygon lat/lon coordinates array, and id #
app.get('/zone', (req, res) => {
    const lnglat = req.headers.lnglat.split(",").map(num => parseFloat(num))
    //res.render('mapzone.ejs', { lnglat: lnglat })
    const id = req.headers.id
    //res.render('mapzone.ejs', { id: id })
    //const layers = req.headers.layers
    console.log(lnglat)
    console.log(id)
    //console.log(layers)
    //res.json({message: 'hello from the route'})
})


//POST - zone data with input name 

//PUT (UPDATE) longitude/latitude coordinates 
    //change the updataArea function in 'draw.update'

//GET customer from search
app.get('/address', async (req, res) => {
    try {
        const customer = await db.customer.findOne({
            where: { phone: req.query.address },
            include: [db.location]
        })
        const response = await geocodingClient.forwardGeocode({
            query: `${customer.get().locations[0].get().address}`
        }).send()
        const coordinates = response.body.features[0].center
        res.render('show.ejs', { customer: customer.get(), mapkey: process.env.MAPBOX_TOKEN, coordinates })
    } catch (error) {
        console.log(error)
    }
})
//1. grab the customer //DONE"center":[-73.98113,40.687204],"geometry":{"type":"Point","coordinates":[-73.98113,40.687204]}
// 2. grab the address //DONE "center":[-73.97589,40.74468]"center":[-73.97589,40.74468]
// 3. geocode address to coordinates DONE
// 4. pass coordinates as variable to res.render DONNNEEE
// 5. add coordinates to the map on the frontend FINITOOOOOO

app.use('/customers', require('./controllers/customers'))
    
app.listen(PORT, () => console.log(chalk.bold.rgb(10,100,200)`smooth sounds of port ${PORT}🗺`))

// console.log(chalk`{bold.rgb(10,100,200) Hello!}`)
// console.log(chalk.bold.rgb(10, 100, 200)('Hello!'));
// console.log(chalk.bold.rgb(10, 100, 200)`Hello!`)
//chalk.bgKeyword('orange')('Some orange text'