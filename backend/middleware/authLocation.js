import jwt from 'jsonwebtoken'

// location authentication middleware
const authLocation = async (req, res, next) => {
    const { ltoken } = req.headers
    if (!ltoken) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }
    try {
        const token_decode = jwt.verify(ltoken, process.env.JWT_SECRET)
        req.body.locId = token_decode.id
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authLocation;