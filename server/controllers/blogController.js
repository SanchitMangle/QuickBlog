import fs from 'fs'
import imagekit from '../config/imageKit.js'
import Blog from '../models/blog.js'
import Comment from '../models/comment.js'
import main from '../config/grmini.js'

export const addBlog = async (req, res) => {

    try {

        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog)
        const imageFile = req.file

        if (!title || !subTitle || !description || !category) {
            res.json({ success: false, message: "Missing Required Feilds" })
        }

        // Upload Image to imageKit
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/blogs'
        })

        // Optimize through imageKit transformatiom 
        const optimizeImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { quality: 'auto' },//Auto compression
                { format: 'webp' },//convert to modern format
                { width: '1280' } //Width resize
            ]

        })

        const image = optimizeImageUrl;

        await Blog.create({
            title,
            subTitle,
            description,
            category,
            image,
            isPublished
        })

        res.json({ success: true, message: 'Blog Added Successfully' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true })
        res.json({ success: true, blogs })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.params
        const blog = await Blog.findById(blogId)

        if (!blog) {
            res.json({ success: false, message: "Blog Not Found" })
        }

        res.json({ success: true, blog })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


export const DeleteBlogById = async (req, res) => {
    try {
        const { id } = req.body
        await Blog.findByIdAndDelete(id)
        // Delete all comments associated with this blog
        await Comment.deleteMany({ blog: id })
        res.json({ success: true, message: 'Blog Deleted Successfully' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export const toggleIsPublished = async (req, res) => {
    try {
        const { id } = req.body
        const blog = await Blog.findById(id)
        blog.isPublished = !blog.isPublished
        await blog.save()
        res.json({ success: true, message: 'Blog Status Updated' })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


export const addComment = async (req, res) => {
    try {
        const { blog, name, content } = req.body
        await Comment.create({ blog, name, content })
        res.json({ success: true, message: "Comment Added For Review" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export const getAllComments = async (req, res) => {
    try {
        const { blogId } = req.body
        const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 })
        res.json({ success: true, comments })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export const generateContent = async (req, res) => {
    try {
        const { prompt } = req.body
        const content = await main(prompt + ' Generate a blog content for this topic in simple text format')
        res.json({ success: true, content })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}