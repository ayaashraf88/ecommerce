import Category from "../../../DB/Models/category.js"
import { checkIfModelFound, createModel } from "../../../DB/dbModels.js"
import slugify from "slugify"
import cloudinaryConnection from "../../utils/cloudinary.js"
import uniqueString from "../../utils/generate-unique-string.js"
import subCategory from "../../../DB/Models/sub-category.js"
import Brand from "../../../DB/Models/brands.js"
export const addCategory = async (req, res, next) => {
    const { name } = req.body
    const _id = req.authUser
    const isNameDublicated = await checkIfModelFound(Category, { name })
    if (!isNameDublicated.success) {
        const slug = slugify(name, '-');
        if (req.file) {
            const folder_id = uniqueString(5)
            const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(req.file.path, {
                folder: `${process.env.main_project}/categories/${folder_id}`,
            })
            req.folder= `${process.env.main_project}/categories/${folder_id}`
            console.log( `${process.env.main_project}/categories/${folder_id}`)
          
            const newCategory = await createModel(Category, {
                name,
                slug,
                image: {
                    secure_url,
                    public_id
                },
                folder_id,
                addedBy: _id,
                updatedBy: null
            })
           
            if (newCategory.success) {
                req.savedDocument={
                    model:Category,
                    id: newCategory.model.id
                }
                return res.status(200).json({
                    status: true,
                    message: "Category Added Successfully",
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
    const all = await Category.find().populate([{
        path: "SubCategories",
        populate: [{ path: "Brands" }]
    },

    ])
    return res.status(200).json({
        status: true,
        message: "All Categories",
        data: all
    })
}
export const deleteCategory = async (req, res, next) => {
    const category_id = req.params.category_id
    const category = await Category.findByIdAndDelete(category_id)
    const sub_category = await subCategory.deleteMany({ parentCategory: category_id })
    if (sub_category.deletedCount <= 0) {
        console.log("there is no subcategories to delete")
    }
    const brands = await Brand.deleteMany({ parentCategory: category_id })
    if (brands.deletedCount <= 0) {
        console.log("there is no brands to delete")
    }
  
    await cloudinaryConnection().api.delete_resources_by_prefix(`${process.env.main_project}/Categories/${category.folder_id}`)
    await cloudinaryConnection().api.delete_folder(`${process.env.main_project}/Categories/${category.folder_id}`)

    return res.status(200).json({
        status: true,
        message: "Category Deleted Successfully",
        data: category
    })
}