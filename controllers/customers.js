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
        const [newCusty, custyCreated] = await db.customer.findOrCreate({
            where: {
                phone: req.query.phone,
                firstName: req.query.firstName,
                lastName: req.query.lastName
            }
        })
        const [newLocation, locationCreated] = await db.location.findOrCreate({
            where: {
                customerId: req.params.customerId,
                address: req.query.address
            }
        })
        await newCusty.addLocation(location)
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

module.exports = router
