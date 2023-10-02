const express = require("express")

const fs = require("fs")

const adminSignUp = express.Router()

adminSignUp.post("/", (req, res) => {
    let userDeets = req.body
    console.log(userDeets)

    fs.readFile("./db/admin.json", 'utf8', (err, data) => {
        if(err){
            console.log(err)
        }

        if(!data){
            data = "[]"
        }

        let userInfo = JSON.parse(data)

        userDeets.apiKey = Math.random().toString(36).substring(2,7);
        
        userDeets.role = "admin"

        let updatedUser = [...userInfo, userDeets] //find solution it says no iterable and the push deltes everything in db

        fs.writeFile("./db/admin.json", JSON.stringify(updatedUser), (err) => {
            if(err){
                res.send("An error occured while trying to sign up user")
            }
            res.end(`Your apikey is ${userDeets.apikey}`)
        })

        
    }) 
})



module.exports = adminSignUp