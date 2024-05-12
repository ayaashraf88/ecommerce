export const rollbackDocments=async(req,res,next)=>{
    if(req.savedDocument){
        console.log("rollback documents")
        const model= req.savedDocument.model
        const _id= req.savedDocument.id
        await model.findByIdAndDelete(_id)
    }
    next()
}