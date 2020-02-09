const generateMessages=(name,text)=>
{
    const d=new Date()
    return{
        username:name,
        text:text,
        CreatedAt:d.getTime()
    }

}
const generateLocationMessages=(name,url)=>
{
    const d=new Date()
    return{
        username:name,
        url:url,
        CreatedAt:d.getTime()

    }
}
module.exports={
    generateMessages,
    generateLocationMessages
}