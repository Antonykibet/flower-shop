let menu = document.querySelector('.bi-list')
let userIcon = document.querySelector('.bi-person-circle')
let loginDropdown=document.querySelector('.loginDropdown')
let navDropdown = document.querySelector('.desktopNav')

init()
async function init(){
    await hiddenBtns()
}
userIcon.addEventListener('click',()=>{
    loginDropdown.classList.toggle('show')
})
menu.addEventListener('click',()=>{
    
    if(navDropdown.style.display=='none'){
        navDropdown.style.display='flex'
        return
    }
    navDropdown.style.display='none'
})

async function hiddenBtns(){
    let response = await fetch('/role')
    let result = await response.json()
    const {role}=result
    if(role=='admin'){
        loginDropdown.innerHTML+=`<a href="/admin/dashboard">Admin Dashboard</a>`
    }
    if(role=='user'){
        loginDropdown.innerHTML+=`<a href="/subscribe">Subscriptions</a>`
    }
}
