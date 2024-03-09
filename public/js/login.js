let eyeIcon = document.getElementsByClassName('eyeIcon')
let passwordInput = document.getElementById('password')
let confirmPassInput = document.getElementById('confirmPassword')||null

let forgotBtn = document.getElementById('forgot')

forgotBtn.addEventListener('click',async()=>{
    let email = document.getElementById('username').value
    if(email==''){
        alert('Enter email address')
        return
    }
    let response = await fetch('/forgotPassword',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({email}),
    })
    let result = await response.json()
    alert(result)
})

eyeIcon.item(0).addEventListener('click',(event)=>{
    hidePass(passwordInput,event.target,0)
})

if(confirmPassInput){
    eyeIcon.item(1).addEventListener('click',(event)=>{
        hidePass(confirmPassInput,event.target,1)
    })
}

function hidePass(input,target,index){
    let icon = document.getElementsByTagName('i')[index];
    if(input.type=='password'){
        input.type='text'
        icon.className = 'bi bi-eye-fill eyeIcon';
    }else{
        input.type='password'
        icon.className = 'bi bi-eye-slash-fill eyeIcon';
    }
}

