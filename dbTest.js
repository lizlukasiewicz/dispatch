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
                phone: '(555)555-5555',
                firstName: 'strover',
                lastName: 'strover'
            }
        })
        const [newLocation, locationCreated] = await db.location.findOrCreate({
            where: {
                customerId: 2,
                address: '179 Starr street, Brooklyn NY'
            }
        })
        await newCusty.addLocation(location)
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

async function addPet() {
    try {
        const options = {
            where: {
                name: 'Cat',
                species: 'Jetpack cat'
            },
            default: {
                description: 'Awesome cat that flies in a jetpack✈️'
            }
        }
        // ARRAY DESTRUCTING - easy way to put array and object into variables
        const [pet, crmmeneated] = await db.pet.findOrCreate(options)
        //find user
        const user = await db.user.findOne()
        //associate the user with the pet
        await user.addPet(pet)
        console.log(`user ${user.firstName} now has a pet named ${pet.name}`)
    } catch (error) {
        console.log(error)
    }
}
// addPet()

//INCLUDES/EAGER LOADING - find a user and bring all the pets associated with them
async function eagerLoading() {
    try {
        const users = await db.user.findAll({
            include: [db.pet]
        })
        users.forEach(user => {
            console.log(`${user.firstName}'s pets:`)
            user.pets.forEach(pet => {
                console.log(pet.name)
            })
        })
    } catch (error) {
        console.log(error)
    }
}
// eagerLoading()