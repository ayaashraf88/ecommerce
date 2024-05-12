import slugify from "slugify";
import Brand from "../../../DB/Models/brands.js";
import Product from "../../../DB/Models/product.js";

import cloudinaryConnection from "../../utils/cloudinary.js";
import uniqueString from "../../utils/generate-unique-string.js";
import { createModel } from "../../../DB/dbModels.js";
import { pagination } from "../../utils/pagination.js";
import { ApiFeatures } from "../../utils/api-features.js";


export const addProduct = async (req, res, next) => {
    const { category_id, sub_category_id, brand_id } = req.query
    const { name, quantity, price, desc, spec, discount } = req.body
    const addedBy = req.authUser;
    const brand = await Brand.findById(brand_id);
    if (!brand) {
        return next({ message: "Brand is not Found" })

    }
    else if (brand.parentCategory.toString() !== category_id) {
        return next({ message: "Category is not Found" })
    }
    else if (brand.parentSubCategory.toString() !== sub_category_id) {
        return next({ message: "SubCategory is not Found" })
    }
    const slug = slugify(name, { lower: true, replacement: '-' })
    const appliedPrice = price - (price * (discount || 0) / 100)
    if (req.files?.length < 0) return next({ message: "You have upload image for this product" })
    const folder_id = uniqueString(4)
    let images = []
    const folder = brand.image.public_id.split(`${brand.folder_id}/`)[0];

    for (const file of req.files) {
        const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(file.path, {
            folder: folder + `${brand.folder_id}`
        })
        images.push({ secure_url, public_id })
    }
    // console.log(images)
    // console.log(folder_id)
    req.folder = folder + `${brand.folder_id}`
    const product = {
        name,
        slug,
        category_id,
        subCategory_id: sub_category_id,
        price,
        quantity,
        appliedPrice,
        brand_id,
        folder_id,
        desc,
        specifications: JSON.parse(spec),
        discount,
        images,
        addedBy
    }

    const newProduct = await createModel(Product, product)
    req.savedDocument = {
        model: Product,
        id: newProduct.model.id
    }
    if (newProduct.success) {
        return res.status(200).json({
            status: true,
            message: "Product Added Successfully",
            data: newProduct.model
        })
    } else {
        return res.status(newProduct.status).json({
            status: false,
            message: newProduct.message
        })
    }
}
export const updateProduct = async (req, res, next) => {
    const { id } = req.params
    const { name, quantity, price, desc, spec, discount, oldPuplicId } = req.body
    const updatedBy = req.authUser;
    const product = await Product.findById(id);
    if (!product) {
        return next({ message: "Product is not Found" })
    }
    if (name) {
        product.name = name
        product.slug = slugify(name, { lower: true, replacement: '-' })
    }
    if (desc) {
        product.desc = desc
    }

    if (spec) {
        product.specifications = JSON.parse(spec)
    }

    if (discount) {
        product.discount = discount
        if (price) {
            product.appliedPrice = price - price * (discount / 100)
        } else {
            product.appliedPrice = product.price - product.price * (discount / 100)
        }

    }

    if (quantity) {
        product.quantity = quantity
    }
    if (price) {
        product.price = price
        product.appliedPrice = price - price * ((discount || 0) / 100)
    }
    if (oldPuplicId) {
        if (!req.file)
            return next({ cause: 404, message: "Image is not found" })
        const folderPath = product.images[0].public_id.split(`${product.folder_id}/`)[0]

        const newPulicId = oldPuplicId.split(`${product.folder_id}/`)[1]
        const { secure_url, puplic_id } = await cloudinaryConnection().uploader.upload(req.file.path, {
            folder: folderPath + `${product.folder_id}`,
            public_id: newPulicId
        })
        product.images.map(img => {
            if (img.public_id === oldPuplicId) {
                img.secure_url = secure_url
            }
        })
    }
    const updatedProduct = await product.save()
    req.savedDocument = {
        model: Product,
        id: updatedProduct.model.id
    }
    res.status(200).json({
        status: true,
        message: "Product Updated Successfully",
        data: updatedProduct
    })
}
export const allProducts = async (req, res, next) => {
    const { page, size, sort } = req.query
    if (sort) {
        const features = new ApiFeatures(req.query, Product.find()).paginations().sort();
    } else {
    }
    //const features = new ApiFeatures(req.query, Product.find()).paginations().search()
    const features = new ApiFeatures(req.query, Product.find()).paginations().filter()
    const all = await features.mongooseQuery
    // const {limit,skip}= pagination({page,size})
    // const all=await Product.find().limit(limit).skip(skip)
    res.status(200).json({
        status: true,
        message: "All Products",
        data: all
    })
}