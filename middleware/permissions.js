/**
 * 1. Provide 2 different endpoints for creating users, one automatically assigns the user as `user` and then the other assigns the user as an admin.
 * 2. When you are creating the user, generate a fixed length random string alongside the data you store. We can call this random string `apiKey`. Which means 
 * during signup. The complete data we are writing to the database would look like.
 * {
 *  "username": "some_username",
 *  "password": "password_chosen",
 *  "role": "admin | user",
 *  "apiKey": "random_string_of_specific_length"
 * }
 * 3. When the user authenticates, what you return after finding the user is their apiKey.
 * 
 * 
 */


const { readFile } = require("fs")



const checkUser = () => {
    return new Promise((resolve, reject) => {
        readFile("./db/usersdb.json", "utf8", (err, data) => {
            if(err){
                console.log(err)
                reject()
                return
            }
            resolve (data)
        })
        
    })
}





function userPermission(roleRequired) {
    return( async (req, res, next) => {
        let apiKey = req.query.apiKey

        const vibe = await checkUser()

        const db = JSON.parse(vibe)
        
        const findUser = db.find(user => user.apiKey === apiKey)

        console.log(findUser)

        if(!findUser){
            res.status(403).send("The Apikey provided is invalid")
            return
        }

        if(findUser.role !== roleRequired){
            res.status(403).send("You do not have permission to view this file")
            return
        }


        // if(!userRole){
        //     res.send("You need userRole to access this route")
        // }

        // if(!parameter.includes(userRole)){
        //     res.send("Your user does not have permission to access this route")
        // }
        
        next()
    })

}




module.exports ={ userPermission }