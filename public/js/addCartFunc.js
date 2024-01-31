export async function storeCartItems(cartItems){
    (typeof(Storage) !== "undefined")?localStorage.setItem('calyxCartItems',JSON.stringify(cartItems)):await addCartSession(cartItems)
}
export async function getCartItems(){
    let cartItems = (typeof(Storage) !== "undefined")?JSON.parse(localStorage.getItem('calyxCartItems'))||[]:await getSessionCartItems()
    console.log(cartItems)
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
