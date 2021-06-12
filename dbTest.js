const db = require('./models')

db.customer.create({
  phone: '917-547-8361',
  firstName: 'Yubaba',
  lastName: 'zeniba'
})
.then(customer => {
  console.log(customer.get())
})

// db.article.findOne({
//   where: { id: 1 },
//   include: [db.comment]
// }).then(article => {
//   // by using eager loading, the article model should have a comments key
//   console.log(article.comments)
// })