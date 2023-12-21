let lists = document.querySelectorAll('.CRUD')
let orderTrack=document.getElementById('orderTrack')
let items = []
let subscibedItems = []

async function getItems(){
    let response = await fetch('/getProducts')
    let result = await response.json()
    result.forEach((item)=>{
        items.push(item)
    })
}
getItems()
getOrderdItems()


function productDropdownFunc(div){
    const productsDropdown = div.querySelector('#productsDropdown')
    items.forEach((item)=>{
        productsDropdown.innerHTML+=`<option  class='productItems' value="${item._id}" >${item.name}</option>`
    })
    
}

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
        
        
        modalBackground.querySelector('.bi-x-circle').addEventListener('click', () => {
            // Close the modal or perform any desired action here
            modalBackground.remove();
        });
        document.body.appendChild(modalBackground)
    })
})

async function getOrderdItems(){
    let response=await fetch('/admin/subscribedItems')
    subscibedItems=await response.json()
    displaySubscribedItems()
}

function deliveryDate(interval) {
    let today = new Date()
    let nextDate
    if(interval=='Weekly'){
        nextDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
    if(interval=='fortnight'){
        nextDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    }
    const day = String(nextDate.getDate()).padStart(2, '0');
    const month = String(nextDate.getMonth() + 1).padStart(2, '0');
    const year = nextDate.getFullYear();
  
    return `${day}/${month}/${year}`;
  }

function displaySubscribedItems(){
    subscibedItems.forEach((item,index)=>{
        let {_id,name,phoneNo,intervals,subscription,deliveries,totalDeliveries,lastDelivery,nextDelivery} = item
        let list = document.createElement('div')
        list.classList.add('orderRecord')
        list.innerHTML=orderList(name,phoneNo,intervals,subscription,deliveries,totalDeliveries,lastDelivery,nextDelivery)
        let deliverBtn = list.querySelector('#deliverBtn')
        deliverBtn.addEventListener('click', async()=>{
            waitProcessDisplay()
            lastDelivery=list.querySelector('#nextDelivery').dataset.value
            nextDelivery=deliveryDate(intervals)
            await updateDelivery(deliveries,totalDeliveries,_id,list,lastDelivery,nextDelivery)
            location.reload(true)
        })
        orderTrack.appendChild(list)
    })
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
function orderList(name,phoneNo,intervals,subscription,deliveries,totalDeliveries,lastDelivery,nextDelivery){
    return `
    <div class="credentials">
        <p id="name">${name}</p>
        <p>${phoneNo}</p>
    </div>
    <div class="productItems">

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
            <select class='input' id="productsDropdown" name='prodId'></select>
            <div>
                <label for="catalogue">Catalogue</label>
                <select class='input'  name="catalogue" id="catalogue">
                    <option value="Congratulation">Congratulations</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Love and Romance">Love and Romance</option>
                    <option value="Thank You">Thank You</option>
                    <option value="addOns">Add Ons</option>
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
            <input class='input' type="text" name='catalogue' placeholder="Catalogue">
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

function deleteForm(){
    return `
    <div id='deleteModal' class='modal'>
        <i class="bi bi-x-circle"></i>
        <h1 >Delete Product</h1>
        <form action="/admin/delete" method="post" >
            <label for='productsDropdown'>Product name</label>
            <select class='input' id="productsDropdown" name='prodId'></select>
            <button type='submit' class='submitBtn'>Delete</button>
        </form>
    </div>
    `
}
