const socket = io() //by this we are going to communicate with the server

const $form = document.querySelector('#form')
const $input = $form.querySelector('input')
const $button = document.querySelector('#button')
const $locbutton = document.querySelector('#find-me')
const $messages = document.querySelector('#messages')


//templates
const $messagetemplate = document.querySelector('#message-template').innerHTML //to acess the html inside the template....template can be thought of a variable in which we can store the dynamic data which will be displayed in messages div place
const locationtemplate = document.querySelector('#location-template').innerHTML
const sidebartemplate=document.querySelector('#sidebar-template').innerHTML

//qs
const{username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})  //location.search se url mil jayega ..?k baad se pura phir  ? hatane k liye ignoreQueryPrefix


document.querySelector('#form').addEventListener('submit', (e) => {
    //after submitting we want to disable the button till we have sent the message
    $button.setAttribute('disabled', 'disabled')
    e.preventDefault()
    const msg = e.target.elements.input.value //form k ander jo input h uske name ko access kar k value le skte h....name="input"
    socket.emit('sendmessage', msg, (abusive) => //sent from client to server
        {

            //after the message is sent to the server we what the button to be enabled again and input form to be cleared of the previous value and bring the focus back at input form
            $button.removeAttribute('disabled')
            $input.value = ''
            $input.focus()
            //the callback will run after the data is processed by the server ie after its counterpart on server runs
            if (abusive) {
                return console.log(abusive)
            }
            console.log('message delivered')

        })
})

socket.on('message', (info) => //received from server to client
    {
        const html = Mustache.render($messagetemplate, {
            username:info.username,
            message: info.text, //message is the variable we have put in the form
            CreatedAt: moment(info.CreatedAt).format('h:m a')
        })
        $messages.insertAdjacentHTML('beforeend', html) //inserting the value of template in the position...beforeeand means before the ending of our $messages elemnet ie new msgs will be displayed at bottom 
        console.log(info)


    })

socket.on('locationMessage', (info) => {
    const html = Mustache.render(locationtemplate, {
        username:info.username,
        url: info.url,
        CreatedAt: moment(info.CreatedAt).format('h:m a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    console.log(info)
    //console.log('location shared')

})

socket.on('roomdata',({room,users})=>
{
    const html=Mustache.render(sidebartemplate,{
        room:room,
        users:users
    })
    document.querySelector('#sidebar').innerHTML=html


})



document.querySelector('#find-me').addEventListener('click', () => {


    if (!navigator.geolocation) {
        return alert('geolocation is not supported by your browser')
    }
    //disable after clicking
    $locbutton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        const loc = {}
        loc[0] = latitude
        loc[1] = longitude
        socket.emit('sendlocation', (loc), () => //call back is for event acknolwdgement
            {
                console.log('location shared')
                $locbutton.removeAttribute('disabled')

            })

    })
})

socket.emit('join',{username,room},(error)=>
 { 
    if(error)
    {
     alert(error)
     location.href='/' //to send back to the join page
    }
}   
)