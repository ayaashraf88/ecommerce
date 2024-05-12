
export const checkIfModelFound=async(model,query)=>{
    const checkModel=await model.findOne(query);
    if(!checkModel){
        return {msg:"notFound",status:404,success:false}
    }else{
        return {msg: `model is found`,status:200,success:true,model:checkModel}
    } 
}
export const createModel=async(model,query)=>{
    const create=await model.create(query)
    if(create){
        return {msg:"created",status:200,success:true,model:create}
    }
    else{
        return {msg:"notCreated",status:404,success:false}
    }
}
export const updateModel=async(model,_id,query)=>{
    const update= await model.updateOne({_id},query, {
        new: true
    })
    if(!update){
        return {msg:"notUpdated",status:404,success:false}
    }
    else{
        return {msg:"updated",status:200,success:true}
    }
}