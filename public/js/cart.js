import { getCartItems,storeCartItems } from "./addCartFunc.js"
let contentDiv = document.getElementById('content')
let totalPrice =document.getElementById('totalPrice')
let mobileCheckoutBtn=document.getElementById('checkoutDisplay')
//let creditBtn = document.querySelector('.intaSendPayButton')
let pesapalCheckoutBtn = document.querySelector('#pesapalCheckoutBtn')
const form = document.getElementById('billingForm');
let billingDiv=document.getElementById('billingDiv')
let removeBtn=document.querySelector('.bi-x-circle')
let cartItems = null


function isCheckoutFormValid(){
    let phoneNo = document.querySelector('#phoneNo')
    let formInputs =document.querySelectorAll('.billingInput')
    totalPrice = parseFloat(totalPrice.textContent);
    if (totalPrice === 0) {
        alert("Cart is Empty, continue shopping.");
        return true
    }
    if(phoneNo.value.length < 10){
        alert('Incomplete phone number')
        return true
    }
    for(let i=0;i<formInputs.length;i++){
        if(formInputs[i].value.trim()===''){
            alert(`${formInputs[i].placeholder} input is empty!`)
            return true
        }
    }
    return false;
}

/*function intSendPayment(form){
    IntaSend({
        publicAPIKey: "ISPubKey_test_87bb04e5-be8e-49d2-a4e2-a749b532a0f3",
        live: false //set to true when going live
      })
        .on("COMPLETE", (results) => {
          // Handle successful payment
          alert("Payment successful!");
          // Submit the form after successful payment
          form.submit();
          localStorage.removeItem('calyxCartItems')
        })
        .on("FAILED", (results) => {
          // Handle failed payment
          alert("Payment failed!");
        })
        .on("IN-PROGRESS", (results) => {
          // Handle payment in progress status
          alert("Payment in progress...");
        });
}*/
function paymentMethodAttribute(form,method){
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'payment_method';
    input.value = method;  
    form.appendChild(input);
}
pesapalCheckoutBtn.addEventListener('click',async (event)=>{
    event.preventDefault();
    const cartItems = await getCartItems()
    const cartDetails = cartItems.map((item)=>{
        return {id:item._id,unit:item.unit}
    })
    console.log(cartDetails)
    let response = await fetch('/cartDetails',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartDetails),
      })
      console.log(response)
    //if(isCheckoutFormValid()) return
    paymentMethodAttribute(form,'pesapal')
    event.target.form.submit()
})

async function renderCartItems(){
    cartItems = await getCartItems()
    //displays the checkout btn mobile
    if(cartItems.length==0){
        mobileCheckoutBtn.style.display='none'
    }
    displayCartItems()
    calcTotal()
}
renderCartItems()

mobileCheckoutBtn.addEventListener('click',(req,res)=>{
    billingDiv.style.display='flex'
})
removeBtn.addEventListener('click',()=>{
    billingDiv.style.display='none'
})



//Calculates total price of cart Items
function calcTotal(){
    let total = 0
    cartItems.forEach((item)=>{
        total+= Number(item.price*item.unit) 
    }) 
    totalPrice.innerText=total
}



function displayCartItems(){
    cartItems.forEach((item,index)=>{
        let {name,price,image,unit} = item
        let bigDiv = document.createElement('div')
        bigDiv.classList.add('cartProductDiv')
        bigDiv.innerHTML=`
            <img class='cartProductImage' src='/images/${image}'>
            <div class='productDesc'>
                <h2 class='cartName'>${name}</h2>
                <div class='secondRow'>
                    <h3 class='cartPrice'>${price}</h3>
                </div>
                <div style='display:flex;align-items:center;margin-bottom:8px;'>
                    <i class="bi bi-dash-lg" index='${index}'></i>
                    <div class='digitDisplay ' id='div${index}' >${unit}</div>
                    <i class="bi bi-plus-lg " index='${index}'></i>
                </div>
                <div class='thirdRow'>
                    <i class="bi bi-trash3" index='${index}'></i>
                 </div>
            </div>
            `
            contentDiv.appendChild(bigDiv)
            addFunc(bigDiv,item)
            subFunc(bigDiv,item)
            removeFunc(bigDiv,item)
        })
        //calcTotal()
}


function addFunc(div,item){
    let addBtn = div.querySelector('.bi-plus-lg')
    addBtn.addEventListener('click',async()=>{
        let {unit} = item
        unit+=1
        let itemIndex = cartItems.indexOf(item)
        cartItems[itemIndex].unit = unit
        div.querySelector('.digitDisplay').innerText=unit
        calcTotal()
        await updFunc()
    })
}

function subFunc(div,item){
    let subBtn = div.querySelector('.bi-dash-lg')
    subBtn.addEventListener('click',async()=>{
        let {unit} = item
        if(unit!==1){
            unit-=1
            let itemIndex = cartItems.indexOf(item)
            cartItems[itemIndex].unit = unit
            div.querySelector('.digitDisplay').innerText=unit
            calcTotal()
            await updFunc()
        }
    })
}


function removeFunc(div,item){
    let removeBtn =div.querySelector('.bi-trash3')
    removeBtn.addEventListener('click',async()=>{
        let index = cartItems.indexOf(item)
        cartItems.splice(index,1)
        div.remove()
        calcTotal()
        await updFunc()
        location.reload()
    })
}


async function updFunc(){
    //totalPrice.innerText= calcTotal()
    await storeCartItems(cartItems)
}

