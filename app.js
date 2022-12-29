const express = require("express");
const app = express();
const bodyParser = require('body-parser');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbConnect = require("./db/dbConnection");

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
  });
  
const User = require('./db/userModal');
const auth = require('./auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

dbConnect();
app.post("/register", (req, res) => {
    bcrypt.hash(req.body.passward, 10).then((hasedpassward) => {
        const user = new User(
            {
                email: req.body.email,
                passward: hasedpassward,
            }
        );
        user.save().then((result) => {
            res.status(201).send(
                {
                    message: "User created successfully",
                    result
                }
            )
        }).catch((error) => {
            res.status(500).send({
                message: "User not created successfully",
                error
            })
        })
    })
        .catch((e) => {
            res.status(500).send({
                message: "Passward not bcrypt successfuly",
                e
            })
        });

})
app.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }).then((user) => {
        bcrypt.compare(req.body.passward, user.passward).then((passwardCheck) => {
            if (!passwardCheck) {
                return res.status(400).send({
                    message: "Passward not matched",
                    error,
                })
            }

            const token = jwt.sign(
                {
                    userId: user._id,
                    userEmail: user.email
                },
                "RANDOM-TOKEN",
                {
                    expiresIn: "24h"
                }
            )
            res.status(200).send({
                message: "Login Successful",
                email: user.email,
                token,
            });
        }).catch((error) => {
            res.status(400).send({
                message: "Passward does not matched",
                error
            })
        })
    }
    ).catch((e) => {
        res.status(404).send({
            message: "Email does not found",
            e
        })
    })

})

app.get("/free-endpoint", (req, res) => {
    res.json({
        message: "You can excess this without authorization"
    })
})

app.get("/auth-endpoint", auth, (req, res) => {
    res.json({
        message: "You can not excess this without authorization"
    })
})
module.exports = app;