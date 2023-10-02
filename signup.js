const express = require("express")

// const userDb = require("./db/usersdb.json")

const fs = require("fs")

const signUpRoute = express.Router()

// const app = express()

// app.use(express.json())

signUpRoute.post("/", (req, res) => {
    let userDeets = req.body
    console.log(userDeets)

    fs.readFile("./db/usersdb.json", 'utf8', (err, data) => {
        if(err){
            console.log(err)
        }

        if(!data){
            data = "[]"
        }

        let userInfo = JSON.parse(data)

        userDeets.apiKey = Math.random().toString(36).substring(2,7);
        
        userDeets.role = "user"

        let updatedUser = [...userInfo, userDeets] //find solution it says no iterable and the push deltes everything in db

        fs.writeFile("./db/usersdb.json", JSON.stringify(updatedUser), (err) => {
            if(err){
                res.send("An error occured while trying to sign up user")
            }
            res.end(`Your apikey is ${userDeets.apikey}`)
        })

        
    }) 
})




// app.listen(3000, () => {
//     console.log("The app is listening on port 3000")
// })

module.exports = signUpRoute