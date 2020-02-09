const users=[]

const addusers=({id,username,room})=>
{   
    username.trim().toLowerCase()
    room.trim().toLowerCase()

    if(!username || ! room)
    {
        return ('username and room is required')
    }

    const existing=users.find((user)=>
    {
        return username===user.username && user.room===room
    })

    if(existing)
    {
        return {
            error:'username already used'
        }
    }
    const user={username,id,room}
    users.push(user)
    return {user}

}

const removeuser=(id)=>
{
    const index=users.findIndex((user)=>
    {
        return user.id===id
    })
    if(index!=-1)
    {
        return users.splice(index,1)[0]   //removes at that index and returns the removed document
    }
    

}
const getuser=(id)=>
{
    const u=users.find((user)=>
    {
        if(user.id===id)
        {
            return user
        }
    })
  return( u?u:'undefined')

}
const getUsersinRoom=(room)=>
{
    const u=[]
     users.find((user)=>
    {
        if(user.room===room)
        {
            u.push(user)
        }
    })

    return(u?u:[])

}

module.exports={
    addusers,
    removeuser,
    getuser,
    getUsersinRoom
}