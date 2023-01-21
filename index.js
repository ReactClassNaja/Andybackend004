const express = require('express')
var bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')
const cookieParser = require('cookie-parser')
const app = express()
const port = 3000

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12jack@@',
    database: 'vite',
    port: '3308'
  })

connection.connect()

app.get('/', (req, res) => {
    // var sql = 'SELECT id, name FROM user'
    // var sql = "INSERT INTO user (id, name, password) VALUES ('3', 'anny', '111')"
    // connection.query(sql, (err, rows, fields) => {
    //     if (err) throw err

    //     var data = {
    //         data: rows,
    //         status: 200,
    //         message: 'success'
    //     }

    //     res.send('sucess')
    // })
})

app.get('/getuser/:userid', (req, res) => {
    var sql = "SELECT * FROM user WHERE id = ?"
    connection.query(sql,[req.params.userid], (err, rows, fields) => {
        if (err) throw err
        res.send(rows)
    })
})

app.post('/createuser', (req, res) => {
    var name = req.body.name
    var email = req.body.email
    var password = req.body.password
    var params = [name, email, password]
    var sql = "INSERT INTO user (name, email, password) VALUES (?, ?, ?)"
    connection.query(sql,params, (err, rows, fields) => {
        if (err) throw err
        
        res.send('sucess')
    })
})

app.post('/login', (req, res) => {
    var email = req.body.email
    var password = req.body.password
    var params = [email, password]
    var sql = "SELECT id FROM user WHERE email = ? AND password = ?"
    connection.query(sql,params, (err, rows, fields) => {
        if (err) {
            throw err
        }else{
            if(rows.length > 0){
                res.cookie("login", rows[0].id)
                let data = {
                    status: 200,
                    message: 'success'
                }
                res.send(data)
            }else{
                res.send('fail')
            }
        }
    })
})

app.post('/isLoggedIn', (req, res) => {
    console.log(req.cookies)
    if(req.cookies.login){
        let data = {
            status: 200,
            message: "logged in"
        }
        res.send(data)
    }else{
        res.send('no cookies')
    }
})

// app.put('/updateuser', (req, res) => {
//     var name = req.body.name
//     var password = req.body.password
//     var id = req.body.id
//     var params = [name, password, id]
//     var sql = "UPDATE user SET name = ?, password = ? WHERE id = ? "
//     connection.query(sql,params, (err, rows, fields) => {
//         if (err) throw err
        
//         res.send('update sucess')
//     })
// })

app.put('/updateuser', (req, res) => {
    var id = req.body.id
    var firstname = req.body.firstname
    var lastname = req.body.lastname
    var name = req.body.name
    var email = req.body.email
    var password = req.body.password
    var params = [firstname, lastname, name, email, password, id]
    var sql = "UPDATE user SET firstname = ?, lastname = ?, name = ?, email = ?, password = ? WHERE id = ? "
    connection.query(sql,params, (err, rows, fields) => {
        if (err) throw err
        res.send('update sucess')
    })
    // res.send(req.body)
})

app.delete('/deleteuser', (req, res) => {
    var sql = "DELETE FROM user WHERE id = 4"
    connection.query(sql,[], (err, rows, fields) => {
        if (err) throw err
        
        res.send('delete sucess')
    })
})

app.listen(port)