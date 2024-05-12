export const globalResponse=(err,req,res,next)=>{
    if(err){
             res.status(err.status||500).json({
                state:false,
                err:err.message,
                data:[]
            })
    }
    next()
}