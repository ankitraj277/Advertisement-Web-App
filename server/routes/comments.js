const express = require("express");
const router = express.Router();
const { comments } = require("../models");
const {validateToken} = require("../middlewares/Authentication");

router.get("/:postId", async(req,res) => {     //route to comments of a post by postId
    const postId = req.params.postId;
    const Comments = await comments.findAll({ where: { PostId:postId } });
    res.json(Comments);
});

router.post("/", validateToken, async(req, res)=>{
    const comment = req.body;
    const username = req.user.username;
    comment.username = username;
    await comments.create(comment);
    res.json(comment);
})
module.exports = router;