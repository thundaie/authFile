const express = require("express")

const signUpRoute = require("./signup")

const adminSignUp = require("./adminSignUp")

const { userPermission } = require("./middleware/permissions")

const app = express()

const path = require("path")

app.use(express.json())

require("dotenv").config()


const PORT = process.env.PORT

app.use("/signup", signUpRoute)

app.use("/admin", adminSignUp)

app.use(express.static('htmlfiles'))

let userFile = path.join(__dirname, "db", "items.json")

app.get("/", (req, res) => {
    res.send("Welconme to our Home Page")
})

app.get("/inventory", userPermission("user"), (req, res) => {
    res.sendFile(userFile)
})

app.post("/create", userPermission("admin"), (req, res) => {
    let newInventory = req.body

    if(!newInventory){
        res.send("Add item you wish to create")
    }

    fs.readFile('./db/items.json', 'utf8', (err, data) => {
        if(err){
            res.send("Internal Server error while fetching file").status(500)
        }

        let parsedData = JSON.parse(data)

        console.log(parsedData)

        let dataLength = parsedData.length

        newInventory.id = dataLength + 1

        let currentInventory = [...parsedData, newInventory]

        fs.writeFile('./db/items.json', JSON.stringify(currentInventory), (err)=>{
            if(err){
                res.send("An error occured while trying to save your file to our database").status(500)
            }
            res.end("Your file has been uploaded successfully")
        })
    })    

})

app.put("/update/:id", userPermission("admin"), (req, res) => {

    let updateId = req.params.id

    let updateItem = req.body

    if(!updateId || !updateItem){
        res.send("Parameter declaration missing")
    }

    fs.readFile('./db/items.json', 'utf8', (err, data) => {
        if(err){
            res.send("An internal server error occured").status(500)
        }
        let inventory = JSON.parse(data)

        let itemFound = inventory.find(data => data.id === parseInt(updateId))

        if(!itemFound){
            res.send("The item you are looking to update does not exist")
        }

        inventory[updateId] = updateItem

        console.log(inventory)

        fs.writeFile('./db/items.json', JSON.stringify(inventory), (err)=> {
            if(err){
                res.send("An error occured while attempting to update Inventory")
            }
            res.end("The inventory has been updated successfully")
        })
    })
    
})


app.delete("/:id", userPermission("admin"), (req, res) => {
    let deleteId = req.params.id

    if(!deleteId){
        res.send("Provide your Id")
    }

    fs.readFile('./db/items.json', 'utf8', (err, data) => {
        if(err){
            res.send("Server error").status(500)
        }

        let inventory = JSON.parse(data)

        let deleted = inventory.find(file => file.id === parseInt(deleteId))

        if(!deleted){
            res.send("The item you want to delete does not exist")
        }

        inventory.splice(deleted, 1)

        fs.writeFile('./db/items.json', JSON.stringify(inventory), (err) => {
            if(err){
                res.send("An error occured while attempting to delete your file")
            }
            res.end("The inventory has been deleted successfully")
        })
    })
})




app.listen(PORT, () => {
    console.log(`The server is listening at http://localhost:${PORT}`)
})