const express = require("express");
const router = express.Router();
const {Users} = require("../models");
const bcrypt = require("bcrypt");
const {ValidateToken, validateToken} = require('../middlewares/Authentication')
const {sign} = require("jsonwebtoken");

router.post("/", async(req,res) =>{
    const { username, password} = req.body;
    bcrypt.hash(password, 10).then((hash) => {     // passing the password and hash it and then
        Users.create({
            username: username,
            password: hash,
        });
        res.json("Success");
    });
});

router.post("/login", async(req,res) => {
    const {username, password} = req.body;

    const user = await Users.findOne({where: {username: username}});  //go to user table and find one user whose username 
                                                                      // is equal to username given
    if(!user) return res.json({error:"user not exist"});

    bcrypt.compare(password, user.password).then((match) =>{
        if(!match) return res.json({error: "wrong combination"});

        const accessToken = sign({username: user.username, id: user.id}, "importantsecret");
        return res.json(accessToken);
    });                                                 
});                      
router.get('/auth',validateToken, (req,res) => {
    res.json(req.user);
})
module.exports = router;