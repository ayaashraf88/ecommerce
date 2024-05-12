import SubCategory from "../../../DB/Models/sub-category.js"
import { checkIfModelFound, createModel } from "../../../DB/dbModels.js"
import slugify from "slugify"
import cloudinaryConnection from "../../utils/cloudinary.js"
import uniqueString from "../../utils/generate-unique-string.js"
import category from "../../../DB/Models/category.js"
export const addCategory = async (req, res, next) => {
    const { name, parentCategory } = req.body
    const _id = req.authUser
    const isNameDublicated = await checkIfModelFound(SubCategory, { name })
    if (!isNameDublicated.success) {
        const slug = slugify(name, '-');
        const checkCategory = await checkIfModelFound(category, { _id: parentCategory })
        if (checkCategory.success) {
            if (req.file) {
                const folder_id = uniqueString(5)
                const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(req.file.path, {
                    folder: `${process.env.main_project}/categories/${checkCategory.model.folder_id}/subcategories/${folder_id}`,
                })
                const newCategory = await createModel(SubCategory, {
                    name,
                    slug,
                    image: {
                        secure_url,
                        public_id
                    },
                    folder_id,
                    parentCategory,
                    addedBy: _id,
                    updatedBy: null
                })
                if (newCategory.success) {
                    return res.status(200).json({
                        status: true,
                        message: "SubCategory Added Successfully",
                        data: newCategory.model
                    })
                } else {
                    return res.status(newCategory.status).json({
                        status: false,
                        message: newCategory.message
                    })
                }
            } else {
                return next({ cause: 404, message: "Image is Required" })
            }



        }
        else {
            return res.status(checkCategory.status).json({
                status: false,
                message: checkCategory.msg
            })
        }


    } else {
        return res.status(isNameDublicated.status).json({
            status: false,
            message: isNameDublicated.msg
        })
    }
}
export const updateCategory = async (req, res, next) => {
    const { name, oldPuplicId } = req.body
    const _id = req.authUser
    const category_id = req.params.category_id

    const checkCategory = await checkIfModelFound(Category, { _id: category_id })

    if (checkCategory.success) {
        console.log(checkCategory.model.name)
        if (name) {
            // const checkName = await checkIfModelFound(Category, { name })
            const isNameDuplicated = await Category.findOne({ name })
            if (!isNameDuplicated) {

                const slug = slugify(name, '-');
                checkCategory.model.name = name
                checkCategory.model.slug = slug
            }

        }
        if (oldPuplicId) {
            if (!req.file)
                return next({ cause: 404, message: "Image is not found" })
            const newPulicId = oldPuplicId.split(`${checkCategory.model.folder_id}/`)[1]
            const { secure_url } = await cloudinaryConnection().uploader.upload(req.file.path, {
                folder: `${process.env.main_project}/Categories/${checkCategory.model.folder_id}`,
                public_id: newPulicId
            })
            checkCategory.model.image.secure_url = secure_url
        }
        checkCategory.model.updatedBy = _id
        await checkCategory.model.save()

        return res.status(200).json({
            status: true,
            message: "Category Updated Successfully",
            data: checkCategory.model
        })

    } else {
        return res.status(checkCategory.status).json({
            status: false,
            message: checkCategory.msg
        })
    }
}
export const getAllCategories = async (req, res, next) => {
    const all = await Category.find()
    return res.status(200).json({
        status: true,
        message: "All Categories",
        data: all
    })
}