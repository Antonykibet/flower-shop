let lists = document.querySelectorAll('.CRUD')
let eventPhotos = document.getElementById('addEventPhoto')
let removeEventPhotoBtn = document.getElementById('removeEventPhoto')
let subscribersTrack=document.getElementById('subscribersTrack')
let orderTrack=document.getElementById('orderTrack')
let items = []
let subscibedItems = []

import { getMessaging, getToken } from "firebase/messaging";

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
const messaging = getMessaging();
getToken(messaging, { vapidKey: '<YOUR_PUBLIC_VAPID_KEY_HERE>' }).then((currentToken) => {
  if (currentToken) {
    // Send the token to your server and update the UI if necessary
    // ...
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});


async function getItems(){
    let response = await fetch('/getProducts')
    let result = await response.json()
    result.forEach((item)=>{
        items.push(item)
    })
}
getItems()
getSubscribedItems()
getOrderdItems('notDispatched')
function sayHi(){
    alert('Aloo')
}

function productDropdownFunc(div){
    const productsDropdown = div.querySelector('#productsDropdown')
    items.forEach((item)=>{
        productsDropdown.innerHTML+=`<option  class='productItems' value="${item._id}" >${item.name}</option>`
    })
    
}

let orderResultConfig = document.getElementById('orderResultConfig')
orderResultConfig.addEventListener('change',async(e)=>{
    if(e.target.value === 'notDispatched'){
        await getOrderdItems('notDispatched')
    }
    if(e.target.value === 'dispatched'){
        await getOrderdItems('dispatched')
    }
})

function updateSelectFunc(div){
    const productsDropdown = div.querySelector('#productsDropdown')
    productsDropdown.addEventListener('change',()=>{  
        const product_id = productsDropdown.value
        const product = items.find((item)=>item._id==product_id)
        const {description,top,_id,price,name,catalogue} = product
        div.querySelector('#identifier').value=_id
        div.querySelector('#type').value=name
        div.querySelector('#topProduct').checked=top
        div.querySelector('#description').value=description
        div.querySelector('#price').value=price
        div.querySelector('#catalogue').value=catalogue
    })
}
async function getEvents(){
    try {
        let response = await fetch('/getEvents')
        let result = await response.json()
        return result
    } catch (error) {
        console.log(`Error at getting events: ${error}`)
        return []
    }
}
removeEventPhotoBtn.addEventListener('click',async(e)=>{
    let modalBackground = document.createElement('div')
    modalBackground.classList.add('modalBackground')
    modalBackground.innerHTML=removeEventPhoto()
    modalBackground.querySelector('.bi-x-circle').addEventListener('click', () => {
        // Close the modal or perform any desired action here
        modalBackground.remove();
    });
    document.body.appendChild(modalBackground)
    let events = await getEvents()
    events.forEach((event)=>{
        modalBackground.querySelector('#eventList').innerHTML+=`<option value='${event._id}'>${event.title}</option>`
    })

})
eventPhotos.addEventListener('click',(e)=>{
    let modalBackground = document.createElement('div')
    modalBackground.classList.add('modalBackground')
    modalBackground.innerHTML=addEventPhotoForm()
    modalBackground.querySelector('.bi-x-circle').addEventListener('click', () => {
        // Close the modal or perform any desired action here
        modalBackground.remove();
    });
    document.body.appendChild(modalBackground)
})

lists.forEach((list)=>{
    list.addEventListener('click',()=>{
        let modalBackground = document.createElement('div')
        modalBackground.classList.add('modalBackground')
        if(list.getAttribute('id')=='create'){
            modalBackground.innerHTML=createForm()
        } 
        if(list.getAttribute('id')=='update'){
            modalBackground.innerHTML=updateForm()
            productDropdownFunc(modalBackground)
            updateSelectFunc(modalBackground)
        }
        if(list.getAttribute('id')=='delete'){
            modalBackground.innerHTML=deleteForm()
            productDropdownFunc(modalBackground)
        }
        if(list.getAttribute('id')=='discount'){
            modalBackground.innerHTML=discountForm()
            
        }
        
        modalBackground.querySelector('.bi-x-circle').addEventListener('click', () => {
            // Close the modal or perform any desired action here
            modalBackground.remove();
        });
        document.body.appendChild(modalBackground)
    })
})

async function getSubscribedItems(){
    let response=await fetch('/admin/subscribedItems')
    subscibedItems=await response.json()
    displaySubscribedItems()
}
async function getOrderdItems(filter){
    let response=await fetch(`/admin/orderdItems/${filter}`)
    let orderItems=await response.json()
    orderTrack.innerHTML=''
    orderItems.forEach((item,index)=>{
        const {_id,name,phoneNo,email,totalPrice,logistics,deliveryDate,address,deliveryTime,reciepientName,note,dispatched, shippingCost} = item
        let cart=item.cart 
        console.log(item)
        let list = document.createElement('div')
        list.classList.add('orderRecord')
        list.innerHTML=orderList(_id,name,email,phoneNo,totalPrice,cart,logistics,deliveryDate,address,deliveryTime,reciepientName,note,dispatched,shippingCost)
        orderTrack.appendChild(list)
        let dispatchBtn = list.querySelector('#dispatchBtn')
        dispatchBtn.addEventListener('click', async(e)=>{
            let _id = e.target.getAttribute('_id')
            await fetch('/admin/dispatched ',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json' // Indicate sending JSON data
                  },
                  body: JSON.stringify({ _id })
            })   
            location.reload()         
        })
        if(filter==='dispatched'){
            dispatchBtn.disabled = true
        }
    })
}

function orderList(_id,name,email,phoneNo,totalPrice,cart,logistics,deliveryDate,address,deliveryTime,reciepientName,note,dispatched,shippingCost){
    let orderedProducts = ''
    cart.forEach((item)=>{
        orderedProducts+=`<a href='/product/${item._id}' >${item.name}| Units:${item.unit} </a> ,`
    })
    return `
    <div class="credentials">
        <p id="name">${name}</p>
        <p>${email}</p>
        <p>${phoneNo}</p>
    </div>
    <div style='display:flex;flex-direction:row;border-right:none;'>
        <div style='display:flex;flex-direction:column;'>
            <p>Address/Location:${address}</p> 
            <p>Delivery time:${deliveryTime}</p>
        </div>
        <div >
            <p>Logistics:${logistics}</p>
            <p>Delivery date:${deliveryDate}</p>
        </div>
        <div style='display:flex;flex-direction:column;'>
            <p>Recepient name:${reciepientName}</p>
            <p>Note:${note}</p>
        </div>
    </div>
    <div  class="productItems">
        <p>${orderedProducts}</p>
    </div>
    <div>
        <p>Shipping Cost:${shippingCost}</p>
    </div>
    <div>
        <p>${totalPrice}</p>
    </div>
    <div style='display:flex;justify-content:center; align-items:center;' >
        <button id='dispatchBtn' _id=${_id} style='height:24px;'>Dispatch</button>
    </div>
    `
}

function deliveryDate(interval) {
    let today = new Date()
    let nextDate
    if(interval=='weekly'){
        nextDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
    if(interval=='fortnight'){
        nextDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    }
    const day = String(nextDate.getDate()).padStart(2, '0');
    const month = String(nextDate.getMonth() + 1).padStart(2, '0');
    const year = nextDate.getFullYear();
  
    return `${year}-${month}-${day}`;
  }

function displaySubscribedItems(){
    subscibedItems.forEach((item,index)=>{
        let {_id,name,phoneNo,intervals,subscription,deliveries,totalDeliveries,lastDelivery,nextDelivery} = item
        let list = document.createElement('div')
        list.classList.add('orderRecord')
        list.innerHTML=subscriberList(name,phoneNo,intervals,subscription,deliveries,totalDeliveries,lastDelivery,nextDelivery)
        let deliverBtn = list.querySelector('#deliverBtn')
        deliverBtn.addEventListener('click', async()=>{
            waitProcessDisplay()
            lastDelivery=list.querySelector('#nextDelivery').dataset.value
            
            nextDelivery=deliveryDate(intervals)
            await updateDelivery(deliveries,totalDeliveries,_id,list,lastDelivery,nextDelivery)
            location.reload(true)
        })
        subscribersTrack.appendChild(list)
    })
}  
//compare delivery dates
function isDeliveryDateValid(last,next){
    let lastDate = new Date(last)
    let nextDate = new Date(next)
    
}
function waitProcessDisplay(){
    let modalBackground = document.createElement('div')
    modalBackground.classList.add('modalBackground')
    modalBackground.innerHTML=` 
        <div id='pleaseWaitModal' class='modal'>
            <h1 id='pleaseWait'>Please wait ...</h1>
        </div>
    `
    document.body.appendChild(modalBackground)
}

async function updateDelivery(deliveries,totalDeliveries,_id,element,lastDelivery,nextDelivery){
    if(deliveries>=totalDeliveries)return
    await fetch('/admin/updateDeliverRecords', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id:_id,
            lastDelivery,
            nextDelivery,
        })
    })
}
function subscriberList(name,phoneNo,intervals,subscription,deliveries,totalDeliveries,lastDelivery,nextDelivery){
    return `
    <div class="subscriberCredentials">
        <p id="name">${name}</p>
        <p>${phoneNo}</p>
    </div>
    <div id='deliveryRecordDiv'>
        <p>${deliveries}/${JSON.stringify(totalDeliveries)}</p>
    </div>
    <div>
        <p>${subscription}</p>
        <p>${intervals}</p>
    </div>
    <div>
        <p id='nextDelivery' data-value='${nextDelivery}''>Next Delivery: ${nextDelivery}</p>
        <p id='lastDelivery' data-value='${lastDelivery}'>Last Delivery: ${lastDelivery}</p>
    </div>
    <div>
        <button id='deliverBtn'>Deliver</button>
    </div>
    `
}



function updateForm(){
    return  `
    <div class='modal'>
        <i class="bi bi-x-circle"></i>
        <h1>Update Product</h1>
        <form action="/admin/update" method="post" enctype='multipart/form-data'>
            <label for='productsDropdown'>Product name</label>
            <select class='input' id="productsDropdown" name='prodId'>
                <option>Select product to update</option>
            </select>
            <div>
                <label for="catalogue">Catalogue</label>
                <select class='input'  name="catalogue" id="catalogue">
                    <option value="Birthday">Birthday</option>
                    <option value="Congratulation">Congratulation</option>
                    <option value="Love and Romance">Love and Romance</option>
                    <option value="Thank You">Thank You</option>
                    <option value="For Him">For Him</option>
                    <option value="Mother's Day">Mother's Day</option>
                    <option value="Get Well">Get Well</option>
                    <option value="Funeral">Funeral</option>
                    <optgroup label='Add Ons'>
                        <option value='addOns:chocolates'>addOns:chocolates</option>
                        <option value='addOns:wine'>addOns:wine</option>
                    </optgroup>
                    <optgroup label='Valentine'>
                        <option value="Valentines:flowers">Valentines:flowers</option>
                        <option value="Valentines:flowerPackages">Valentines:flowerPackages</option>
                        <option value="Valentines:teddyPackages">Valentines:teddyPackages</option>
                        <option value="Valentines:teddy">Valentines:teddy</option>
                    </optgroup>
                </select>
            </div>
            <input type='text' id='identifier' style='display:none;'>
            <input name='name' class='input' id='type' type="text" placeholder="Name">
            <input name='price' class='input' id='price' type="text" placeholder="price">
            <input name='description' class='input' id='description' type="text" placeholder="description">
            <input  class='input' id='mainImage' type="file" name='mainImage' accept='.jpeg, .jpg, .png' placeholder="MainImage">
            <input class='input' id='otherImages' type="file" name='otherImages' multiple accept='.jpeg, .jpg, .png'  placeholder="Other Images">
            
            <div>
                <input class='input' type="checkbox" name="topProduct" id="topProduct">
                <label for="topProduct">To Appear in Top Products Section</label>
            </div>
            <button type ='submit' class='submitBtn'>Update<button>
        </form>
    </div>
    `
}
function createForm(){
    return `
    <div class='modal'>
        <i class="bi bi-x-circle"></i>
        <h1 style='padding-top:0px;'>Create Product</h1>
        <form action="/admin/create" method="post" enctype="multipart/form-data">
            <input class='input' type="text" name='name' placeholder="Product name">
            <input class='input' type="text" name='price' placeholder="Price">
            <div>
                <label for="catalogue">Catalogue :</label> 
                <select class='input' name="catalogue" id="catalogue">
                    <option value="Birthday">Birthday</option>
                    <option value="Congratulation">Congratulation</option>
                    <option value="Love and Romance">Love and Romance</option>
                    <option value="Thank You">Thank You</option>
                    <option value="For Him">For Him</option>
                    <option value="Mother's Day">Mother's Day</option>
                    <option value="Get Well">Get Well</option>
                    <option value="Funeral">Funeral</option>
                    <optgroup label='Add ons'>
                        <option value='addOns:chocolates'>addOns:chocolates</option>
                        <option value='addOns:wine'>addOns:wine</option>
                    </optgroup>
                    <optgroup label='Valentine'>
                        <option value="Valentines:flowers">Valentines:flowers</option>
                        <option value="Valentines:flowerPackages">Valentines:flowerPackages</option>
                        <option value="Valentines:teddyPackages">Valentines:teddyPackages</option>
                        <option value="Valentines:teddy">Valentines:teddy</option>
                    </optgroup>
                </select>
            </div>
            <input class='input' type="text" name='description' placeholder="Description">
            <input class='input' type="file" name='mainImage' accept='.jpeg, .jpg, .png' placeholder="MainImage">
            <input class='input' type="file" name='otherImages' multiple accept='.jpeg, .jpg, .png'  placeholder="Other Images">
            <div>
                <input type="checkbox" name="topProduct" id="topProduct">
                <label for="topProduct">To Appear in Top Products Section</label>
            </div>
            <button type='submit' class='submitBtn'>Create</button>
        </form>
    </div>
    `
}
function discountForm(){
    return `
    <div id='discountModal' class='modal'>
        <i class="bi bi-x-circle"></i>
        <h1 >Set Discount</h1>
        <form action="/admin/discount" method="post" >
            <input style='width:50%' class='input' type="text" name='discount' placeholder="Set discount percentage eg 30">
            <button type='submit' class='submitBtn'>Set Discount</button>
        </form>
    </div>
    `
}
function deleteForm(){
    return `
    <div id='deleteModal' class='modal'>
        <i class="bi bi-x-circle"></i>
        <h1 >Delete Product</h1>
        <form action="/admin/delete" method="post" >
            <label for='productsDropdown'>Product name</label>
            <select class='input' id="productsDropdown" name='prodId'>
                <option>Select product to delete</option>
            </select>
            <button type='submit' class='submitBtn'>Delete</button>
        </form>
    </div>
    `
}
function removeEventPhoto(){
    return `
    <div class='modal'>
        <i class="bi bi-x-circle"></i>
        <h1 style='padding-top:0px;'>Delete Event</h1>
        <form action="/admin/removeEventPhoto"  method="post" >
            <select name='event' id='eventList'>
                <option>Select Event to delete</option>
            </select>
            <button type= 'submit' class='submitBtn'>Remove</button>
        </form>
    </div>`
}
function addEventPhotoForm(){
    return `
    <div class='modal'>
        <i class="bi bi-x-circle"></i>
        <h1 style='padding-top:0px;'>Add Event</h1>
        <form action="/admin/addEventPhoto" method="post" enctype="multipart/form-data">
            <input class='input' type="text" name='eventTitle' placeholder="Event title">
            <input class='input' type="file" name='image' multiple accept='.jpeg, .jpg, .png'  placeholder="Other Images">
            <input style='width:50%' class='input' type="text" name='caption' placeholder="Caption...">
            <button type='submit' class='submitBtn'>Add Event</button>
        </form>
    </div>`
}