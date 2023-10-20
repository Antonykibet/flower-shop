let lists = document.querySelectorAll('.CRUD')
let orderTrack=document.getElementById('orderTrack')
let items = []
let orderItems = []

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

        const {description,top,_id,price,name} = product 
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
            modalBackground.innerHTM.nameL=deleteFo.namerm()
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
    let response=await fetch('/admin/orderdItems')
    orderItems=await response.json()
    orderItems.forEach((item,index)=>{
        const {_id,name,phoneNo,email,cart,} = item
        let list = document.createElement('div')
        list.classList.add('orderRecord')
        list.innerHTML=orderList(index,name,email,phoneNo)
        orderTrack.appendChild(list)

        let productItems = list.querySelector('.productItems')
        cart.forEach((item)=>{
            productItems.innerHTML+=`
            <div>
                <p>${item.catalogue}:${item.type}</p>
                <p>Unit:${item.unit}</p>
            </div>
            `
        })
        let status =list.querySelector('#statusElem')
        status.value=item.status
        status.addEventListener('change',async()=>{
            try {
                const data = {name,status:status.value}
                await fetch('/admin/statusUpdate',{
                    method:'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(data)
                })    
                alert('Success')
            } catch (error) {
                alert('Error: Status not updated')
            }
        })
    })
}

function orderList(index,name,email,phoneNo){
    return `
    <div class='index'><h1>${index}</h1></div>
    <div class="credentials">
        <p id="name">${name}</p>
        <p>${email}</p>
        <p>${phoneNo}</p>
    </div>
    <div class="productItems">

    </div>

    <div class="status">
        <select name="" id="statusElem">
            <option value="processing">Processing</option>
            <option value="complete">Complete</option>
            <option value="shipping">Shipping</option>
            <option value="delivered">Delivered</option>
        </select>
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
            <select class='input' id="productsDropdown" name='prodName'></select>
            <div>
                <label for="catalogue">Catalogue</label>
                <select class='input'  name="catalogue" id="catalogue">
                    <option value="Congratulation">Congratulations</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Love and Romance">Love and Romance</option>
                    <option value="Thank You">Thank You</option>
                </select>
            </div>
            <input type='text' id='identifier' style='display:none;'>
            <input class='input' id='type' type="text" placeholder="Name">
            <input class='input' id='price' type="text" placeholder="price">
            <input class='input' id='description' type="text" placeholder="description">
            <input class='input' id='mainImage' type="file" name='mainImage' accept='.jpeg, .jpg, .png' placeholder="MainImage">
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
            <input class='input' type="text" name='type' placeholder="Product name">
            <input class='input' type="text" name='price' placeholder="Price">
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
            <select class='input' id="productsDropdown" name='prodName'></select>
            <button type='submit'>Delete</button>
        </form>
    </div>
    `
}
