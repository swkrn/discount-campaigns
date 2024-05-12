class Item {
    name: string
    price: number
    amount: number
    category: string

    constructor(name: string, price: number, amount: number, type: string) {
        this.name = name
        this.price = price
        this.amount = amount
        this.category = type
    }
}


export default Item