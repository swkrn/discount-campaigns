import Item from "../models/items"

export const fixAmountCoupon = (
    price: number,
    discountAmount: number): number => price - discountAmount


export const percentageDiscountCoupon = (
    price: number,
    discountPercentage: number): number => price * ((100 - discountPercentage) / 100)


export const percentageDiscountByItemCategoryOnTop = (
    price: number,
    itemList: Item[],
    category: string,
    discountPercentage: number
): number => {
    let discountByItemAmount = itemList.filter(e => e.category === category).reduce((p, v) => p + v.price * v.amount, 0) * ((100 - discountPercentage) / 100)
    console.log(discountByItemAmount)
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
    return price - Math.floor(price / everyAmount) * discountAmount
}