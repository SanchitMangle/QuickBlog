import jwt from 'jsonwebtoken'

export const adminAuth = async (req, res, next) => {

    try {
        const token = req.headers.authorization;
        jwt.verify(token, process.env.JWT_SECRETE)
        next()
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}