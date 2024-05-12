import slugify from 'slugify'
import Brand from '../../../DB/Models/brands.js'
import Category from '../../../DB/Models/category.js'
import SubCategory from '../../../DB/Models/sub-category.js'
import { checkIfModelFound, createModel } from '../../../DB/dbModels.js'
import uniqueString from '../../utils/generate-unique-string.js'
import cloudinaryConnection from '../../utils/cloudinary.js'
export const addBrand = async (req, res, next) => {
    const { name } = req.body
    const category_id = req.params.category_id
    const sub_category_id = req.params.sub_category_id
    const _id = req.authUser
    const checkCategory = await checkIfModelFound(Category, { _id: category_id })
    const checkSubCategory = await checkIfModelFound(SubCategory, { _id: sub_category_id })
    if (checkCategory.success && checkSubCategory.success) {
        const checkName = await checkIfModelFound(Brand, { name, parentCategory: category_id, parentSubCategory: sub_category_id })
        if (!checkName.success) {
            const slug = slugify(name, '-');
            if (req.file) {
                const folder_id = uniqueString(5)
                const { public_id, secure_url } = await cloudinaryConnection().uploader.upload(req.file.path, {
                    folder: `${process.env.main_project}/categories/${checkCategory.model.folder_id}/subcategories/${checkSubCategory.model.folder_id}/brands/${folder_id}`,
                })

                const newBrand = await createModel(Brand, {
                    name,
                    slug,
                    parentCategory: category_id,
                    parentSubCategory: sub_category_id,
                    image: { public_id, secure_url },
                    folder_id,
                    addedBy: _id,
                    updatedBy: null
                })
                if (newBrand.success) {
                    return res.status(200).json({
                        status: true,
                        message: "Brand Added Successfully",
                        data: newBrand.model
                    })
                } else {
                    return res.status(404).json({
                        status: false,
                        message: newBrand.msg
                    })
                }

            } else {
                return next({ cause: 404, message: "Image is Required" })
            }

        }
        else {
            return res.status(400).json({
                status: false,
                message: "Check Brand Name for this category and sub category"
            })
        }
    } else {
        return res.status(404).json({
            status: false,
            message: "Check Category Id or Sub Category ID"
        })
    }
}