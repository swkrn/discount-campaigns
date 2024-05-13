import Item from "../models/items"

export const fixAmountCoupon = (
    price: number,
    discountAmount: number): number => Math.max(price - discountAmount, 0)


export const percentageDiscountCoupon = (
    price: number,
    discountPercentage: number): number => Math.max(price * ((100 - discountPercentage) / 100), 0)


export const percentageDiscountByItemCategoryOnTop = (
    price: number,
    itemList: Item[],
    category: string,
    discountPercentage: number
): number => {
    let discountByItemAmount = itemList.filter(e => e.category === category).reduce((p, v) => p + v.price * v.amount, 0) * ((discountPercentage) / 100)
    console.log(discountByItemAmount)
    return Math.max(price - discountByItemAmount, 0)
}


export const discountByPointsOnTop = (
    price: number,
    point: number
): number => {
    const priceWithPoint = price - point
    const priceTwentyPercentageOff = price * 0.8

    return Math.max(Math.max(priceWithPoint, priceTwentyPercentageOff), 0)
}


export const specialCampaignsSeasonal =(
    price: number,
    everyAmount: number,
    discountAmount: number,
): number => {
    return price - Math.floor(price / everyAmount) * discountAmount
}