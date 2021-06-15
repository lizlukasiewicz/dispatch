let express = require('express')
let db = require('../models')
let router = express.Router()


//GET / - display all customers and their locations
router.get('/', async(req, res) => {
    try {
        const customers = await db.customer.findAll({
            include: [db.location]
        })
        customers.forEach(customer => {
            //console.log(`${customer.firstName}'s locations:`)
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
                phone: req.body.phone,
                firstName: req.body.firstName,
                lastName: req.body.lastName
            }
        })
        const [newLocation, locationCreated] = await db.location.findOrCreate({
            where: {
                //customerId: req.params.customerId,
                address: req.body.address
            }
        })
        await newCusty.addLocation(newLocation)
        res.redirect('/customers')
        //console.log(`${newCusty.firstName} lives at ${newLocation.address}`)
    } catch(err) {
        console.log(err)
    }
})

//GET customers/new
router.get('/new', (req, res) => {
    res.render('customers/new.ejs')
})

//GET /edit/:id -- READ (show) for to edit one customer -- to display form
router.get('/edit/:id', (req, res) => {
db.customer.findOne({
    where: { id: req.params.id }
}).then(customer => {
    customer.getLocations()
.then(locations => {
    res.render('customers/edit', {customer, locations})
})
}).catch(error => {
    console.log(error)
})
})

//POST /edit/:id -- UPDATE (edit) one customer -- redirect to customers/index
router.put('/edit/:id', (req, res) => {
    //console.log(req.body.address)
    db.customer.update({
        phone: req.body.phone,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    }, {where: { id: req.params.id }})
    .then(changedCustomer => {
        console.log(changedCustomer)
        db.location.update({
            address: req.body.address
        }, {where: { customerId: req.params.id }}).then(newAddress => {
            console.log(newAddress)
            res.redirect('/customers')
        })
    })
    .catch(error => {
        console.log(error)
    })
})

router.post('/edit/:id/add', (req, res) => {
    db.location.create({
        address: req.body.newAddress,
        customerId: req.params.id
    }).then(addAddress => {
        console.log(addAddress)
        res.redirect('/customers')
    }).catch(error => {
        console.log(error)
    })
})

//DELETE CUSTOMER
router.delete('/edit/:id', (req, res) => {
  db.customer.destroy({
    where: { name: req.body.delete }
  })
  .then(numRowsDeleted=>{
      console.log(numRowsDeleted)
    // do something when done deleting
      res.redirect('/customers')
  });
} )
module.exports = router
