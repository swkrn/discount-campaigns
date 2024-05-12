import Item from "../models/items"

export const fixAmountCoupon = (
    itemList: Item[], 
    discountAmount: number): number => itemList.reduce((p, v) => p + v.price * v.amount, 0) - discountAmount


export const percentageDiscountCoupon = (
    itemList: Item[], 
    discountPercentage: number): number => itemList.reduce((p, v) => p + v.price * v.amount, 0) * ((100 - discountPercentage) / 100)


export const percentageDiscountByItemCategoryOnTop = (
    price: number,
    itemList: Item[],
    category: string,
    discountPercentage: number
): number => {
    let discountByItemAmount = itemList.filter(e => e.category === category).reduce((p, v) => p + v.price * v.amount, 0) * ((100 - discountPercentage) / 100)
    return price - discountByItemAmount
}


export const discountByPointsOnTop = (
    price: number,
    point: number
): number => {
    const priceWithPoint = price - point
    const priceTwentyPercentageOff = price * 0.8

    return Math.max(priceWithPoint, priceTwentyPercentageOff)
}


export const specialCampaignsSeasonal =(
    price: number,
    everyAmount: number,
    discountAmount: number,
): number => {
    return Math.floor(price / everyAmount) * discountAmount
}