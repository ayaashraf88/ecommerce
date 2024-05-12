import Cart from "../../../DB/Models/cart.js"
import Product from "../../../DB/Models/product.js"

export const addToCart = async (req, res, next) => {
    const userId = req.authUser
    const { product_id, quantity } = req.body
    const product = await Product.findById(product_id)
    if (!product) return next({ cause: 404, message: "Product not found" })
    if (product.quantity < quantity) {
        return res.status(400).json({
            status: false,
            message: "Quantity is not available"
        })
    }
    const cart = await Cart.findOne({ user_id: userId })
    if (!cart) {
        const newCart = new Cart({ user_id: userId })
        newCart.products.push({ product_id, quantity, price: product.appliedPrice, finalPrice: product.appliedPrice * quantity })
        newCart.totalPrice = product.appliedPrice * quantity
        await newCart.save()
        res.status(200).json({
            status: true,
            message: "Product Added to Cart",
            data: newCart
        })
    } else {
        const index = cart.products.findIndex(item => item.product_id === product_id)
        const totalQuantity = quantity;
        if (index > -1) {

            cart.products[index].quantity += quantity
            totalQuantity = cart.products[index].quantity
        } else {
            cart.products.push({ product_id, quantity, price: product.appliedPrice, finalPrice: product.appliedPrice * quantity })
        }

        cart.totalPrice += product.appliedPrice * totalQuantity
        await cart.save()
        res.status(200).json({
            status: true,
            message: "Product Added to Cart",
            data: cart
        })

    }
}
export const removeFromCart = async (req, res, next) => {
    const userId = req.authUser
    const { product_id, quantity } = req.body
    const cart = await Cart.findOne({ user_id: userId })
    if (!cart) return next({ cause: 404, message: "Cart not found" })
    const index = cart.products.findIndex(item => item.product_id.toString() === product_id)

    if (index > -1) {
        if (!quantity || quantity == cart.products[index].quantity) {
            const productPrice = cart.products[index].finalPrice
            cart.totalPrice -= productPrice
            cart.products.splice(index, 1)

        } else {
            cart.products[index].quantity = quantity
            cart.products[index].finalPrice = cart.products[index].finalPrice - (quantity * cart.products[index].price)
            cart.totalPrice -= cart.products[index].finalPrice
        }
        await cart.save()
        res.status(200).json({
            status: true,
            message: "Product Removed from Cart",
            data: cart
        })

    } else {
        res.status(400).json({
            status: false,
            message: "Product not found in cart"
        })
    }

}
