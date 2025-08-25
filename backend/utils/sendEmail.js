const nodemailer=require('nodemailer')
const sendEmail=async(to , subject ,html)=>{
    const transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    })

    await transporter.sendMail({
        from:`From ${process.env.EMAIL_USER} supporter in Chat App `,
        to,
        subject,
        html
    })

    console.log(`email send successfuly`);
    
}

module.exports=sendEmail;