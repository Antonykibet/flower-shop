let menu = document.querySelector('.bi-list')
let userIcon = document.querySelector('.bi-person-circle')
let loginDropdown=document.querySelector('.loginDropdown')
let navDropdown = document.querySelector('.desktopNav')

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

async function adminBtn(){
    let response = await fetch('/role')
    let result = await response.json()
    //alert(role)
    if(role=='Admin'){
        headerIcons.forEach((header)=>{
            header.innerHTML+=`
                <a href='/admin/dashboard'><button>Admin</button></a>
            `
        })
    }
}
adminBtn()