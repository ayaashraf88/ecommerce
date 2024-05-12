import multer from "multer";
import { allowedExtensions } from "../utils/allowedExtensions.js";
export const multerHost = ({ extensions = allowedExtensions.image }) => {
    const storage = multer.diskStorage({
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}.${file.originalname}`)
        }
    })
    const fileFilter = (req, file, cb) => {
        if (extensions.includes(file.mimetype.split('/')[1])) {
            return cb(null, true)
        }
        cb(new Error('Image format is not allowed!'), false)
    }
    const file=multer({fileFilter,storage})
    return file
}