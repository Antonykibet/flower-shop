let cartBtn=document.getElementById('cartBtn')
let btnDiv=document.querySelector('.btnDiv')
let item=JSON.parse(cartBtn.value)


//alert(item.catalogue)
async function isLogged(){
    let response= await fetch('/isLogged')
    let result = await response.json() 
    return result
}

if(item.catalogue=='Monthly'||'Quartely'||'Yearly'){
    cartBtn.style.display='none'
    btnDiv.innerHTML+=`
        <button class="CTOs" id="subBtn" >Subscribe</button>
    `
    let subBtn= btnDiv.querySelector('#subBtn')
    subBtn.addEventListener('click',async()=>{
        let loggedIn = await isLogged()
        if(!loggedIn){
            alert('Login to continue with subscription')
            window.location.href = '/login';
        }
        subscriptionPopup()
    })
}

function subscriptionPopup(){
    document.body.style.overflowY='hidden'
    let modalBackground = document.createElement('div')
    modalBackground.classList.add('modalBackground')
    modalBackground.innerHTML=subscriptionForm()
    modalBackground.querySelector('.bi-x-circle').addEventListener('click',()=>{
        modalBackground.remove()
        document.body.style.overflowY='scroll'
    })
    document.body.appendChild(modalBackground)
}
function subscriptionForm(){
    return `
        <div class='modal'>
            <i class="bi bi-x-circle"></i>
                <h2 class='title' id='subTitle'>Subscribe</h2>
                <form id="subscriptionForm" action="/subscribe" method="post">
                    <input class="subInput" placeholder="Full Name" type="text" id="fname" name="name" required>
                    <input class="subInput" placeholder="Phone Number" type="text" name="phoneNo" id="phoneNo" required>
                    <input style='display:none;' name='product' value='${JSON.stringify(item)}'>
                    <textarea class="subInput" name="note" id="addNote" placeholder="Add a note ..."></textarea>
                    <div>
                    <h3>How do you want your flowers delivered:</h3>
                        <input type='radio' id='weekly' name='intervals' value='weekly'>
                        <label for='weekly'>Get flowers on a weekly</label> <br>
                        <input type='radio' id='fortnight' name='intervals' value='fortnight'>
                        <label for='fortnight'>Get flowers after 2 weeks<label> <br>
                    </div>
                    <div id="totalDiv">
                        <h3 class="totalElem">Price</h3>
                        <h3 class="totalElem">${item.price}</h3>
                    </div>
                    <div style='width:100%;display:flex;justify-content:center;'>
                        <button class='CTOs' id='subscribeBtn'>Submit</button>
                    </div>
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