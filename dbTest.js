const db = require('./models')

// db.customer.create({
//   phone: '917-547-8361',
//   firstName: 'Yubaba',
//   lastName: 'zeniba'
// })
// .then(customer => {
//   console.log(customer.get())
// })

// db.article.findOne({
//   where: { id: 1 },
//   include: [db.comment]
// }).then(article => {
//   // by using eager loading, the article model should have a comments key
//   console.log(article.comments)
// })
async function createCusty() {
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
        res.render('customers/index', { customers })
        console.log(`${newCusty.firstName} lives at ${newLocation.address}`)
    } catch(err) {
        console.log(err)
    }
}

// createCusty()
async function newPet() {
    try {
        const user = await db.user.findOne()

        const newPet = await user.createPet({
            name: 'Barko',
            species: 'Barkly'
        })
        console.log(newPet)
    } catch (error) {
        console.log(error)
    }
}
//  newPet()

 // find a user and check their pets
 async function printPet() {
     try {
        //find auser
        const user = await db.user.findOne()

        const pets = await user.getPets()
        console.log(pets)
        // use a mixin to get their associated pets
        // console.log the pets
     } catch (error) {
         console.log(error)
     }
 }
//  printPet()

async function addLocation() {
    try {
        const options = {
            where: {
                address: req.body.address
            },
            default: {
                description: 'Awesome cat that flies in a jetpack✈️'
            }
        }
        // ARRAY DESTRUCTING - easy way to put array and object into variables
        const [location, crmmeneated] = await db.location.findOrCreate(options)
        //find user
        const customer = await db.customer.findOne()
        //associate the user with the pet
        await customer.addLocation(location)
        console.log(`customer ${customer.firstName} lives at ${location.address}`)
    } catch (error) {
        console.log(error)
    }
}
// addLocation()

//INCLUDES/EAGER LOADING - find a user and bring all the pets associated with them
async function eagerLoading() {
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
    } catch (error) {
        console.log(error)
    }
}
 //eagerLoading()