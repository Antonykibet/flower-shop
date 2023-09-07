let eyeIcon = document.getElementsByClassName('eyeIcon')
let passwordInput = document .getElementById('password')
let confirmPassInput = document .getElementById('confirmPassword')||null

eyeIcon.item(0).addEventListener('click',()=>{
    hidePass(passwordInput,'/icons/google icon.png','/icons/hide password icon.png',0)
})

if(confirmPassInput){
    eyeIcon.item(1).addEventListener('click',()=>{
        hidePass(confirmPassInput,'/icons/google icon.png','/icons/hide password icon.png',1)
    })
}

function hidePass(input,unhideIcon,hideIcon,index){
    if(input.type=='password'){
        input.type='text'
        eyeIcon.item(index).src=unhideIcon
    }else{
        input.type='password'
        eyeIcon.item(index).src=hideIcon
    }
}

