import User from "../../../DB/Models/user.js"
import { checkIfModelFound, createModel } from "../../../DB/dbModels.js"
import bcryptjs from "bcryptjs";
import  jwt  from "jsonwebtoken";
import sendEmailService from "../../services/send-email.service.js";
export const signUp = async (req, res, next) => {
    const { username, email, password, age, role, phoneNumbers, address } = req.body
    const isEmailDublicated = await checkIfModelFound(User, { email });
    if (isEmailDublicated.success) {
        return res.status(isEmailDublicated.status).json({
            status: false,
            message: isEmailDublicated.msg
        })
    } else {
        const isUsernameDublicated = await checkIfModelFound(User, { username });
        if (isUsernameDublicated.success) {
            return res.status(isUsernameDublicated.status).json({
                status: false,
                message: isUsernameDublicated.msg
            })
        }
        else {
           const userToken=jwt.sign({email},'jyg3)ll',{expiresIn:'3600s'})
            const isEmailSent = await sendEmailService({
                to: email,
                subject: "Welcome to E-commerce",
                message: `Hello ${username},<br>Welcome to E-commerce. <br>Your account has been created successfully.
                <br>
                <p>Please verify your email</p>
                <a href="http://localhost:3000/auth/verify?token=${userToken}">Click Here</a>
                `
            })
            const newPass = bcryptjs.hashSync(password, 9);

            const createUser = await createModel(User, { email, username, password: newPass, age, role, phoneNumbers, address })
            res.status(201).json(
                {
                    status: true,
                    message: "User Created",
                    data: createUser
                }
            )
        }
    }


}
export const verify = async (req, res, next) => {
    const { token } = req.query
    const email = jwt.verify(token,'jyg3)ll');
    const user = await User.findOneAndUpdate({ email:email.email, isEmailVerified: false }, { isEmailVerified: true }, { new: true })
    res.status(200).json({
        success:true,
        message:"Email Verified Successfully",
        data:user
    })


}
export const signIn = async (req, res, next) => {
    const { email, password } = req.body
    const checkUser = await checkIfModelFound(User, { email ,isEmailVerified:true});
    if (checkUser.success) {
        const checkPassword = bcryptjs.compareSync(password, checkUser.model.password)
        if (checkPassword) {
            const token=jwt.sign({email,_id:checkUser.model._id,LoggedIn:true},process.env.JWT_SECRET,{expiresIn:'1d'})
            checkUser.model.isLoggedIn=true;
            await checkUser.model.save();
            return res.status(200).json({
                success: true,
                message: "Login Success",
                token,
                User: checkUser.model
            })
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            })
        }
    }
    else {
        return next(new Error(`User is not found`));
    }
}