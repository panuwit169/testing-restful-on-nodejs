const express = require('express')
const app = express()

app.use(express.json())

app.post('/cal', (req, res) => {
    const transaction = req.body

    let total_price = 0

    //check items_list
    if(transaction.items_list.length == 0){
        res.status(500).send({ error: 'there must be at least 1 item in the item_list' })
        return
    }

    transaction.items_list.map((list) => {
        //check qty
        if(list.qty < 1){
            res.status(500).send({ error: 'quantity cannot be less than 1' })
            return
        }

        //check price_per_item
        if(list.price_per_item < 1){
            res.status(500).send({ error: 'price_per_item cannot be less than 1' })
            return
        }

        //cal total_price
        total_price += (list.qty * list.price_per_item) * ((100 - list.discount) / 100)
    })
    
    //cal total_price with total_discount
    total_price = total_price * ((100 - transaction.total_discount) / 100)

    //cal total_price and transaction.payment
    if(total_price > transaction.payment){
        res.status(500).send({ error: 'payment must be more than the total price' })
        return
    } 

    res.json({
        total_price: total_price,
        change: transaction.payment - total_price
    })
})
  

app.listen(9000, () => {
    console.log('Application is running on port 9000')
})