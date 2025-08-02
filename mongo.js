const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}
else{
    const password = process.argv[2]
    const url = `mongodb+srv://OogaryoO:${password}@cluster0.fjwbaxm.mongodb.net/Gary\'s_Phonebook?retryWrites=true&w=majority&appName=Cluster0`
    mongoose.set('strictQuery',false)
    mongoose.connect(url)   

    const personSchema = new mongoose.Schema({
        name: String,
        number: String,
    })
    const Person = mongoose.model('Person', personSchema)

    // add phonebook info
    if(process.argv.length === 5){
        
        const addedName = process.argv[3]
        const addedNumber = process.argv[4]
        const person = new Person({
            name: addedName,
            number: addedNumber,
        })

        person.save().then(result => {
            console.log(`added ${addedName} number ${addedNumber} to phonebook`)
            mongoose.connection.close()
        })
    }
    //display all added info
    else if(process.argv.length === 3){
        Person.find({}).then(result => {
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
        })
        
    }
}



// use model's constructor function to create javascript object note
// hence "note" can use methods and properties of model
// const note = new Note({
//   content: 'HTML is easy',
//   important: true,
// })

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

