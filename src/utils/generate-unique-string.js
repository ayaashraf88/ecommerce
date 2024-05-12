import { customAlphabet } from "nanoid";
const uniqueString=(length)=>{
const nanoid=customAlphabet('1234567890abcdef',length||13)
return nanoid()
}
export default uniqueString