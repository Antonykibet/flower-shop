let cartBtn=document.getElementById('cartBtn')
let btnDiv=document.querySelector('.btnDiv')
let item=cartBtn.value

if(item.catalogue=='Monthly'||'Quartely'||'Yearly'){
    cartBtn.style.display='none'
    btnDiv.innerHTML+=`
        <button class="CTOs" id="subBtn">Subscribe</button>
    `
    let subBtn= btnDiv.querySelector('#subBtn')
    subBtn.addEventListener('click',()=>{
        subscriptionPopup()
    })
}

function subscriptionPopup(){
    document.body.style.overflowY='hidden'
    let modalBackground = document.createElement('div')
    modalBackground.classList.add('modalBackground')
    modalBackground.innerHTML=subscriptionForm()
    document.body.appendChild(modalBackground)
}
function subscriptionForm(){
    return `
        <div class='modal'>
            <i class="bi bi-x-circle"></i>
            <form id="subscriptionForm" action="/subscribe" method="post">
                <input type='radio' id='weekly' name='intervals' value='weekly'>
                <label for='weekly'>Get flowers on a weekly<label> <br>
                <input type='radio' id='fortnight' name='intervals' value='fortnight'>
                <label for='fortnight'>Get flowers on a weekly<label> <br>
                <textarea name="note" id="addNote" placeholder="Add a note ..."></textarea>
                <button>Submit</button>
            </form>
        </div>
    `
}

cartBtn.addEventListener('click',()=>{
    addCartFunc(JSON.parse(cartBtn.value))
})
async function addCartFunc(item){
    try {
        if(cartItems.some(cartItem=>cartItem._id===item._id)) return
        cartItems.push(item)
        await fetch('/addCart',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({cartItems:cartItems}),
        })   
    } catch (error) {
        alert(`Error:Did not add to cart.`)
    }
}