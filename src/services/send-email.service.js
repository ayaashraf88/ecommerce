import nodemailer from 'nodemailer';
const sendEmailService=async ({to='',subject='no-reply',message='no message',attachments=[]})=>{
    const transporter=nodemailer.createTransport({
        host:  'localhost',//'smtp.gmail.com',
        service:'gmail',
        port:587,
        secure:false,
        auth:{
            user:'ayaashrafahmed.97@gmail.com',
            pass:'cslqwqhczowkolds'
        }
    })
    const info=await transporter.sendMail(
        {
            from:'ayaashrafahmed.97@gmail.com',
            to,
            subject,
            html:message,
            attachments
        }
    )
    // console.log(info)
    return info;
}
export default sendEmailService
//cslq wqhc zowk olds
