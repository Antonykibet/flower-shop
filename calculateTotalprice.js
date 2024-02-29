const {products} = require('./mongoConfig');
async function calculateTotalPrice(cartProducts) {
    try {
        let totalPrice = 0;

        for (const product of cartProducts) {
            const { _id, unit } = product;

            // Find the product by ID and project only the 'price' field
            const foundProduct = await products.findOne({ _id }, { projection: { price: 1 } });

            if (foundProduct) {
                const productPrice = foundProduct.price;
                totalPrice += productPrice * unit;
            } else {
                console.log(`Product with ID ${_id} not found.`);
            }
        }

        return totalPrice;
    }catch(err){
        console.log(`Error in calculating total price of cart items:${err}`)
    }
}
module.exports = calculateTotalPrice