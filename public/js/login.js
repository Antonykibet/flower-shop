let eyeIcon = document.querySelectorAll('.eyeIcon')
let formInput = document .getElementsByClassName('.formInput')
eyeIcon.forEach((button,index)=>{
  button.addEventListener('click',()=>{
    let input = formInput.item(index)
    if(input.text=='password'){
     formInput.item(index).setAttribute('type','text')
    button.src=//hidden eye
    }
  })else{
     formInput.item(index).setAttribute('type',password)
  }
})