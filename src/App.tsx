import React, { useState } from 'react';
import './App.css';
import Item from './models/items';
import { discountByPointsOnTop, fixAmountCoupon, percentageDiscountByItemCategoryOnTop, percentageDiscountCoupon, specialCampaignsSeasonal } from './utils/discount';

function App() {
    // List
    const [itemList, setItemList] = useState<Item[]>([
        new Item('T-Shirt', 350, 1, 'Clothing'),
        new Item('Hoodie', 700, 1, 'Clothing'),
        new Item('Watch', 850, 1, 'Electronics'),
        new Item('Bag', 640, 1, 'Accessories'),
    ])
    const [categoryList, setCategoryList] = useState<string[]>(['Clothing', 'Accessories', 'Electronics'])

    // Add item input
    const [itemName, setItemName] = useState('')
    const [itemPrice, setItemPrice] = useState(250)
    const [itemAmount, setItemAmount] = useState(1)
    const [itemCategory, setItemCategory] = useState(categoryList[0])

    // Add category input
    const [newCategory, setNewCategory] = useState('')

    // Discount selection
    const [selectedCoupon, setSelectedCoupon] = useState(fixAmountCoupon.name)
    const [selectedOnTop, setSelectedOnTop] = useState(percentageDiscountByItemCategoryOnTop.name)
    const [selectedSeasonal, setSelectedSeasonal] = useState(specialCampaignsSeasonal.name)

    // Coupon campaigns input
    const [couponDiscountAmount, setCouponDiscountAmount] = useState(50)
    const [couponDiscountPercentage, setCouponDiscountPercentage] = useState(10)

    // On-Top campaigns input
    const [onTopCategory, setOnTopCategory] = useState(categoryList[0])
    const [onTopDiscountPercentage, setOnTopDiscountPercentage] = useState(15)
    const [onTopCustomerPoints, setOnTopCustomerPoints] = useState(60)

    // Seasonal campaigns input
    const [seasonalEveryAmount, setSeasonalEveryAmount] = useState(300)
    const [seasonalDiscountAmount, setSeasonalDiscountAmount] = useState(40)


    const totalPrice = (): number => itemList.reduce((p, v) => p + v.price * v.amount, 0)


    // Coupon output
    const couponDiscountPercentageNormalized = selectedCoupon === fixAmountCoupon.name ? couponDiscountAmount / totalPrice() : selectedCoupon === percentageDiscountCoupon.name ? couponDiscountPercentage / 100 : 0
    const itemAfterCouponPriceCut = itemList.map(item => new Item(item.name, item.price * (1 - couponDiscountPercentageNormalized), item.amount, item.category))

    const canAddItem = (): boolean => (itemName.length > 0 && itemPrice >= 0 && itemAmount >= 1 && itemCategory.length > 0)

    const addItem = () => {
        if (!canAddItem()) {
            return
        }
        const item = new Item(itemName, itemPrice, itemAmount, itemCategory)
        setItemList([...itemList, item])
        setItemName('')
    }


    const deleteItem = (itemIndex: number) => {
        const updatedItemList = itemList.filter((item, index) => index !== itemIndex)
        setItemList(updatedItemList)
    }


    const canAddCategory = (): boolean => newCategory.length > 0 && !categoryList.includes(newCategory)


    const addCategory = () => {
        if (!canAddCategory()) {
            return
        }
        setCategoryList([newCategory, ...categoryList])
        setNewCategory('')
    }


    const discountedPrice = (): { [key: string]: number } => {
        let price = totalPrice()

        if (selectedCoupon === fixAmountCoupon.name) {
            price = fixAmountCoupon(price, couponDiscountAmount)
        }
        else if (selectedCoupon === percentageDiscountCoupon.name) {
            price = percentageDiscountCoupon(price, couponDiscountPercentage)
        }

        const couponPrice = price

        if (selectedOnTop === percentageDiscountByItemCategoryOnTop.name) {
            price = percentageDiscountByItemCategoryOnTop(
                price,
                itemAfterCouponPriceCut,
                onTopCategory,
                onTopDiscountPercentage
            )
        }
        else if (selectedOnTop === discountByPointsOnTop.name) {
            price = discountByPointsOnTop(price, onTopCustomerPoints)
        }

        let onTopPrice = price

        if (selectedSeasonal === specialCampaignsSeasonal.name) {
            price = specialCampaignsSeasonal(price, seasonalEveryAmount, seasonalDiscountAmount)
        }

        return {
            'couponPrice': Math.max(couponPrice, 0),
            'onTopPrice': Math.max(onTopPrice, 0),
            'seasonalPrice': Math.max(price, 0),
            'discountedPrice': Math.max(price, 0)
        }
    }

    return (
        <div className="container mt-5 mb-5">
            <div className="row">

                <div className="col m-2">
                    <div>
                        <div className='card p-3 col'>
                            <h2>Discount Campaigns</h2>
                            <div className="discount-type mt-3">
                                <h3>Coupon</h3>
                                <div className="form-check mb-1">
                                    <input
                                        className='form-check-input'
                                        type="radio"
                                        value=''
                                        checked={selectedCoupon === ''}
                                        onChange={() => setSelectedCoupon('')}
                                    />
                                    <label className={`form-check-label ${selectedCoupon === '' ? 'fw-bold' : ''}`}>
                                        None
                                    </label>
                                </div>
                                <div className="form-check mb-1">
                                    <input
                                        className='form-check-input'
                                        type="radio"
                                        value={fixAmountCoupon.name}
                                        checked={selectedCoupon === fixAmountCoupon.name}
                                        onChange={() => setSelectedCoupon(fixAmountCoupon.name)}
                                    />
                                    <label className={`form-check-label ${selectedCoupon === fixAmountCoupon.name ? 'fw-bold' : ''}`}>
                                        Fixed Amount Discount
                                    </label>
                                    {selectedCoupon === fixAmountCoupon.name && <div className='input-group mb-3'>
                                        <span className="input-group-text">-</span>
                                        <input type='number' className={`form-control ${couponDiscountAmount ? '' : 'is-invalid'}`} value={couponDiscountAmount} onChange={e => setCouponDiscountAmount(parseInt(e.target.value))} min='1' placeholder='Amount THB' />
                                        <span className="input-group-text">THB</span>
                                    </div>}
                                </div>
                                <div className="form-check mb-1">
                                    <input
                                        className='form-check-input'
                                        type="radio"
                                        value={percentageDiscountCoupon.name}
                                        checked={selectedCoupon === percentageDiscountCoupon.name}
                                        onChange={() => setSelectedCoupon(percentageDiscountCoupon.name)}
                                    />
                                    <label className={`form-check-label ${selectedCoupon === percentageDiscountCoupon.name ? 'fw-bold': ''}`}>
                                        Percentage Discount
                                    </label>
                                    {selectedCoupon === percentageDiscountCoupon.name && <div className='input-group mb-3'>
                                        <span className="input-group-text">-</span>
                                        <input type='number' className={`form-control ${couponDiscountPercentage ? '' : 'is-invalid'}`} value={couponDiscountPercentage} onChange={e => setCouponDiscountPercentage(parseInt(e.target.value))} min='1' max='100' placeholder='Percentage' />
                                        <span className="input-group-text">%</span>
                                    </div>}
                                </div>
                            </div>

                            <div className="discount-type mt-3">
                                <h3>On-Top</h3>
                                <div className="form-check mb-1">
                                    <input
                                        className='form-check-input'
                                        type="radio"
                                        value=''
                                        checked={selectedOnTop === ''}
                                        onChange={() => setSelectedOnTop('')}
                                    />
                                    <label className={`form-check-label ${selectedOnTop === '' ? 'fw-bold': ''}`}>
                                        None
                                    </label>
                                </div>
                                <div className="form-check mb-1">
                                    <input
                                        className='form-check-input'
                                        type="radio"
                                        value={percentageDiscountByItemCategoryOnTop.name}
                                        checked={selectedOnTop === percentageDiscountByItemCategoryOnTop.name}
                                        onChange={() => setSelectedOnTop(percentageDiscountByItemCategoryOnTop.name)}
                                    />
                                    <label className={`form-check-label ${selectedOnTop === percentageDiscountByItemCategoryOnTop.name ? 'fw-bold': ''}`}>
                                        Percentage Discount by Item Category
                                    </label>
                                    {selectedOnTop === percentageDiscountByItemCategoryOnTop.name && <div>
                                        <select className="form-control mb-3" value={onTopCategory} onChange={e => setOnTopCategory(e.target.value)}>
                                            {categoryList.map(type => <option value={type}>{type}</option>)}
                                        </select>
                                        <div className='input-group mb-3'>
                                            <span className="input-group-text">-</span>
                                            <input type='number' className={`form-control ${onTopDiscountPercentage ? '' : 'is-invalid'}`} value={onTopDiscountPercentage} onChange={e => setOnTopDiscountPercentage(parseInt(e.target.value))} min='1' max='100' placeholder='Percentage' />
                                            <span className="input-group-text">%</span>
                                        </div>
                                    </div>}
                                </div>
                                <div className="form-check mb-1">
                                    <input
                                        className='form-check-input'
                                        type="radio"
                                        value={discountByPointsOnTop.name}
                                        checked={selectedOnTop === discountByPointsOnTop.name}
                                        onChange={() => setSelectedOnTop(discountByPointsOnTop.name)}
                                    />
                                    <label className={`form-check-label ${selectedOnTop === discountByPointsOnTop.name ? 'fw-bold': ''}`}>
                                        Discount by Points
                                    </label>
                                    {selectedOnTop === discountByPointsOnTop.name && <div className='input-group mb-3'>
                                        <input type='number' className={`form-control ${onTopCustomerPoints ? '' : 'is-invalid'}`} value={onTopCustomerPoints} onChange={e => setOnTopCustomerPoints(parseInt(e.target.value))} min='1' placeholder='Points' />
                                        <span className="input-group-text">Points</span>
                                    </div>}
                                </div>
                            </div>

                            <div className="discount-type mt-3">
                                <h3>Seasonal</h3>
                                <div className="form-check mb-1">
                                    <input
                                        className='form-check-input'
                                        type="radio"
                                        value=''
                                        checked={selectedSeasonal === ''}
                                        onChange={() => setSelectedSeasonal('')}
                                    />
                                    <label className={`form-check-label ${selectedSeasonal == '' ? 'fw-bold' : ''}`}>
                                        None
                                    </label>
                                </div>
                                <div className="form-check mb-1">
                                    <input
                                        className='form-check-input'
                                        type="radio"
                                        value={specialCampaignsSeasonal.name}
                                        checked={selectedSeasonal === specialCampaignsSeasonal.name}
                                        onChange={() => setSelectedSeasonal(specialCampaignsSeasonal.name)}
                                    />
                                    <label className={`form-check-label ${selectedSeasonal === specialCampaignsSeasonal.name ? 'fw-bold' : ''}`}>
                                        Special campaigns
                                    </label>
                                    {selectedSeasonal === specialCampaignsSeasonal.name && <div>
                                        <div className='input-group mb-3'>
                                            <span className="input-group-text">-</span>
                                            <input type='number' className={`form-control ${seasonalDiscountAmount ? '' : 'is-invalid'}`} value={seasonalDiscountAmount} onChange={e => setSeasonalDiscountAmount(parseInt(e.target.value))} min='1' placeholder='Discount THB' />
                                            <span className="input-group-text">THB</span>
                                        </div>
                                        <div className='input-group mb-3'>
                                            <span className="input-group-text">Every</span>
                                            <input type='number' className={`form-control ${seasonalEveryAmount ? '' : 'is-invalid'}`} value={seasonalEveryAmount} onChange={e => setSeasonalEveryAmount(parseInt(e.target.value))} min='1' placeholder='Every THB' />
                                            <span className="input-group-text">THB</span>
                                        </div>
                                    </div>}
                                </div>
                            </div>
                        </div>

                        <div className='card p-3 mt-4 form-group d-grid gap-2'>
                            <h2>Add Item</h2>
                            <div className="mb-2">
                                <label className="form-label">Name</label>
                                <input type='text' className={`form-control ${itemName.length > 0 ? '' : 'is-invalid'}`} value={itemName} onChange={e => setItemName(e.target.value)} placeholder='E.g. T-Shirt' />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Price</label>
                                <div className='input-group'>
                                    <input type='number' className={`form-control ${itemPrice ? '' : 'is-invalid'}`} value={itemPrice} onChange={e => setItemPrice(parseInt(e.target.value))} min='1' placeholder='Price' />
                                    <span className="input-group-text">THB</span>
                                </div>
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Amount</label>
                                <input type='number' className={`form-control ${itemAmount ? '' : 'is-invalid'}`} value={itemAmount} onChange={e => setItemAmount(parseInt(e.target.value))} min='1' placeholder='Amount' />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Category</label>
                                <select className="form-control" value={itemCategory} onChange={e => setItemCategory(e.target.value)}>
                                    {categoryList.map(type => <option value={type}>{type}</option>)}
                                </select>
                            </div>
                            <button className={`btn btn-primary ${canAddItem() ? '' : 'disabled'}`} onClick={addItem}>Add</button>
                        </div>

                        <div className="card p-3 form-group d-grid gap-2 mt-4">
                            <h2>Add Category</h2>
                            <div className="mb-2">
                                <input type='text' className={`form-control ${newCategory.length > 0 ? '' : 'is-invalid'}`} value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder='E.g. Furniture' />
                            </div>
                            <button className={`btn btn-primary ${canAddCategory() ? '' : 'disabled'}`} onClick={addCategory}>Add</button>
                        </div>
                    </div>
                </div>

                <div className="col m-2">
                    <div className='card p-3'>
                        <h2>Shopping Cart</h2>
                        {itemList.length <= 0 && <p className='mt-5'>Cart is Empty</p>}
                        {itemList.map((item, index) => (
                            <div key={index} className="card mb-3">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="card-title mb-0">{item.name}</h5>
                                    </div>
                                    <div>
                                        <button onClick={() => deleteItem(index)} className="btn btn-danger btn-sm">Delete</button>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <p className="card-text m-0">{item.price} THB x {item.amount} = {item.price * item.amount} THB</p>
                                    <p className="card-text">{item.category}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="card p-3 mt-4">
                        <h2>Summary</h2>
                        <h4 className='mt-3 mb-3'>Price: {totalPrice().toFixed(2)} THB</h4>

                        {selectedCoupon.length > 0 && <table className='table table-sm mt-2'>
                            <thead>
                                {selectedCoupon === fixAmountCoupon.name && <tr>
                                    <td><b>Coupon Discount (-{couponDiscountAmount} THB)</b></td><td><b>{discountedPrice()['couponPrice'].toFixed(2)} THB</b></td></tr>}
                                {selectedCoupon === percentageDiscountCoupon.name && <tr>
                                    <td><b>Coupon Discount (-{couponDiscountPercentage}%)</b></td><td><b>{discountedPrice()['couponPrice'].toFixed(2)} THB</b></td></tr>}
                            </thead>
                            <tbody>
                                {itemAfterCouponPriceCut.map(item => <tr><td>{item.name}</td><td>{item.price.toFixed(2)} THB</td></tr>)}
                            </tbody>
                        </table>}

                        {selectedOnTop === percentageDiscountByItemCategoryOnTop.name && <table className='table table-sm mt-2'>
                            <thead>
                                <tr><td><b>On-Top Discount on {onTopCategory} (-{onTopDiscountPercentage}%)</b></td><td><b>{discountedPrice()['onTopPrice'].toFixed(2)} THB</b></td></tr>
                            </thead>
                            <tbody>
                                {itemAfterCouponPriceCut.map(item => {
                                    if (item.category === onTopCategory) {
                                        return <tr><td>{item.name} (-{onTopDiscountPercentage}% from {item.price.toFixed(2)} THB)</td><td>{(item.price * (1 - onTopDiscountPercentage / 100)).toFixed(2)} THB</td></tr>
                                    }
                                    return <tr><td>{item.name}</td><td>{item.price.toFixed(2)} THB</td></tr>
                                })}
                            </tbody>
                        </table>}

                        {selectedOnTop === discountByPointsOnTop.name && ((discountedPrice()['couponPrice'] - discountedPrice()['onTopPrice']) >= onTopCustomerPoints) && <table className='table table-sm mt-2'>
                            <thead>
                                <tr><td><b>On-Top Discount ({onTopCustomerPoints} Points)</b></td><td><b>{discountedPrice()['onTopPrice'].toFixed(2)} THB</b></td></tr>
                            </thead>
                            <tbody><tr></tr></tbody>
                        </table>}

                        {selectedOnTop === discountByPointsOnTop.name && ((discountedPrice()['couponPrice'] - discountedPrice()['onTopPrice']) < onTopCustomerPoints) && <table className='table table-sm mt-2'>
                            <thead>
                                <tr><td><b>On-Top Discount (Reach Max -20% Discount - Use {Math.ceil(discountedPrice()['couponPrice'] - discountedPrice()['onTopPrice'])} Points)</b></td><td><b>{discountedPrice()['onTopPrice'].toFixed(2)} THB</b></td></tr>
                            </thead>
                            <tbody><tr></tr></tbody>
                        </table>}

                        {selectedSeasonal === specialCampaignsSeasonal.name && <table className='table table-sm mt-2'>
                            <thead>
                                <tr><td><b>Seasonal Discount [-{seasonalDiscountAmount} THB Every {seasonalEveryAmount} THB] (-{(discountedPrice()['onTopPrice'] - discountedPrice()['seasonalPrice']).toFixed(2)} THB)</b></td><td><b>{discountedPrice()['seasonalPrice'].toFixed(2)} THB</b></td></tr>
                            </thead>
                            <tbody><tr></tr></tbody>
                        </table>}

                        <h3 className='mt-3'>
                            <h3>Discounted Price:</h3>
                            <h3>{discountedPrice()['discountedPrice'].toFixed(2)} THB</h3>
                        </h3>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default App;