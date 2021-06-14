let express = require('express')
let db = require('../models')
let router = express.Router()


//GET / - display all customers and their locations
router.get('/', async(req, res) => {
    //async function eagerLoading() {
    //     try {
    //         const customers = await db.customer.findAll({
    //             include: [db.location]
    //         })
    //         customers.forEach(customer => {
    //             console.log(`${customer.firstName}'s locations:`)
    //             customer.locations.forEach(location => {
    //                 console.log(location.address)
    //             })
    //         })
    //         res.render('customers/index', { customers })
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    // eagerLoading()
    try {
        const customers = await db.customer.findAll({
            include: [db.location]
        })
        customers.forEach(customer => {
            console.log(`${customer.firstName}'s locations:`)
            customer.locations.forEach(location => {
                console.log(location.address)
            })
        })
        res.render('customers/index', { customers })
    } catch (error) {
        console.log(error)
    }
})

//POST new customer new.ejs  (req.query.name req.query.phone req.query.address)
router.post('/new', async(req, res) => {
    try {
        const newCusty = await db.customer.create({
            where: {
                phone: req.body.phone,
                firstName: req.body.firstName,
                lastName: req.body.lastName
            }
        })
        const newLocation = await db.location.create({
            where: {
                //customerId: req.params.customerId,
                address: req.body.address
            }
        })
        await newCusty.addLocation(newLocation)
        res.redirect('customers/index')
        console.log(`${newCusty.firstName} lives at ${newLocation.address}`)
    } catch(err) {
        console.log(err)
    }
})

//GET customers/new
router.get('/new', (req, res) => {
    res.render('customers/new.ejs')
})

//GET /edit/:id -- READ (show) for to edit one customer -- to display form

//PUT /edit/:id -- UPDATE (edit) one customer -- redirect to customers/index

module.exports = router
