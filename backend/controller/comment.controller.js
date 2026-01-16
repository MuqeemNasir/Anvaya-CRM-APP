const mongoose = require('mongoose')
const Comment = require('../models/Comment.model')
const Lead = require('../models/Lead.model')

const addComment = async (req, res) => {
    try {
        const { id } = req.params
        const { commentText, authorId } = req.body

        const lead = await Lead.findById(id)
        if(!lead){
            return res.status(404).json({error: `Lead not found.`})
        }

        const newComment = new Comment({
            lead: id,
            commentText: commentText,
            author: authorId
        })

        const savedComment = await newComment.save()
        const response = await savedComment.populate('author', 'name')

        res.status(201).json({
            id: response._id,
            commentText: response.commentText,
            author: response.author?.name || "System",
            createdAt: response.createdAt
        })
    } catch (error) {
        console.error("addComment error: ", error)
        res.status(500).json({ message: "Server error in adding a comment." })
    }
}

const getAllComments = async(req, res) => {
    try{
        const { id } = req.params
        const allComments = await Comment.find({lead: id}).populate('author', 'name').sort({createdAt: -1})
        const response = allComments.map(comment => ({
            id: comment._id,
            commentText: comment.commentText,
            author: comment.author ? comment.author.name : "Unknown",
            createdAt: comment.createdAt
        }))
        res.status(200).json(response)

    }catch(error){
        console.error("getAllComments error: ", error)
        res.status(500).json({message: "Server error in fetching all comments."})
    }
}

module.exports = { addComment, getAllComments}