import jwt from 'jsonwebtoken'
import User from '../../DB/Models/user.js'
export const auth = (accessRoles) => {
    return async (req, res, next) => {
        const token = req.headers.authorization.split(' ')[1]
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        status: false,
                        message: "Invalid token inside",
                        err
                    })
                }
                const findUser = await User.findById(decoded._id, 'username email role')
                if (!accessRoles.includes(findUser.role)) return next(new Error('unauthorized', { cause: 401 }))
                req.authUser = findUser
                next()
            })
        } else {
            return res.status(401).json({
                status: false,
                message: "Invalid token"
            })
        }
    }
}