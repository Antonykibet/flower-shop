export async function storeCartItems(cartItems){
    (typeof(Storage) !== "undefined")?localStorage.setItem('calyxCartItems',JSON.stringify(cartItems)):await addCartSession(cartItems)
}
export async function getCartItems(){
    let cartItems = (typeof(Storage) !== "undefined")?JSON.parse(localStorage.getItem('calyxCartItems'))||[]:await getSessionCartItems()
    return cartItems
}
async function getSessionCartItems(){
    let response = await fetch('/addCart')
    let result = await response.json()
    return result
}
async function addCartSession(cartItems){
    try {
        await fetch('/addCart',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            
            body:JSON.stringify({cartItems}),
        })
    } catch (error) {
        alert(`Did not add to cart succesfully:${error}`)
    }
}
export async function addCartFunc(item){
    try {
        let cartItems=await getCartItems()
        if(cartItems.some(cartItem=>cartItem._id===item._id)) return
        if(item.catalogue.match(/Valentines/i)){
            alert(`By Booking you'll get your product on 14th Feb, proceed to add more delivery details...`)
        }
        cartItems.push(item)
        await storeCartItems(cartItems)
    } catch (error) {
        alert(`Error:Did not add to cart.`)
    }
}
