import { pagination } from "./pagination.js";

export class ApiFeatures{
    constructor(query,mongooseQuery){
        //req.query
        this.query=query;
        //model.find
        this.mongooseQuery=mongooseQuery;
    }
    paginations(){
        const {page,size}=this.query
        const {limit,skip}= pagination({page,size})
        this.mongooseQuery.limit(limit).skip(skip)
        return this                                                                                               
    }
    sort(){
        const {sort}=this.query
        const formatSort=sort.replace(/asc/g,1).replace(/desc/g,-1).replace(/ /g,':')
        const [key,value]=formatSort.split(":")
        console.log({[key]:parseInt(value)})
        this.mongooseQuery.sort({[key]:parseInt(value)})
        return this
    }
    search(){
        const {...search}=this.query
       
        const queryFilter={}
        if(search.name){
            queryFilter.name={$regex:search.name}
        }
        if(search.desc){
            queryFilter.desc={$regex:search.desc}
        }
        if(search.discount){
            queryFilter.discount={$ne:0}
        }
        if(search.priceFrom)
        {
            queryFilter.price={$gt: search.priceFrom}
        }
        console.log(queryFilter)
        this.mongooseQuery.find(queryFilter)
        return this

    }
    filter(){
        const {...filter}=this.query
        const filters=JSON.stringify(filter).replace(/gte|lte|lt|gt/g,(operator)=>`${operator}`)
        console.log(filters)
        this.mongooseQuery.find(JSON.parse(filters))
        return this

    }
}