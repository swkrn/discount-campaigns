import React, { useState } from 'react';
import './App.css';
import Item from './models/items';
import { discountByPointsOnTop, fixAmountCoupon, percentageDiscountByItemCategoryOnTop, percentageDiscountCoupon, specialCampaignsSeasonal } from './utils/discount';

function App() {
    // List
    const [itemList, setItemList] = useState<Item[]>([])
    const [categoryList, setCategoryList] = useState<string[]>([])

    // Add item input
    const [itemName, setItemName] = useState('')
    const [itemPrice, setItemPrice] = useState(1)
    const [itemAmount, setItemAmount] = useState(1)
    const [itemCategory, setItemCategory] = useState('')

    // Add category input
    const [newCategory, setNewCategory] = useState('')

    // Discount selection
    const [selectedCoupon, setSelectedCoupon] = useState('')
    const [selectedOnTop, setSelectedOnTop] = useState('')
    const [selectedSeasonal, setSelectedSeasonal] = useState('')

    // Coupon campaigns input
    const [couponDiscountAmount, setCouponDiscountAmount] = useState(50)
    const [couponDiscountPercentage, setCouponDiscountPercentage] = useState(10)

    // On-Top campaigns input
    const [onTopCategory, setOnTopCategory] = useState('')
    const [onTopDiscountPercentage, setOnTopDiscountPercentage] = useState(15)
    const [onTopCustomerPoints, setOnTopCustomerPoints] = useState(60)

    // Seasonal campaigns input
    const [seasonalEveryAmount, setSeasonalEveryAmount] = useState(300)
    const [seasonalDiscountAmount, setSeasonalDiscountAmount] = useState(40)


    const addItem = () => {
        if (itemName.length <= 0 || itemPrice < 0 || itemAmount < 1 || itemCategory.length <= 0) {
            return
        }
        const item = new Item(itemName, itemPrice, itemAmount, itemCategory)
        setItemList([...itemList, item])
        setItemName('')
        setItemPrice(0)
        setItemAmount(1)
        setItemCategory('')
    }

    const addCategory = () => {
        if (newCategory.length <= 0) {
            return
        }
        setCategoryList([newCategory, ...categoryList])
        setNewCategory('')
    }

    const totalPrice = (): number => itemList.reduce((p, v) => p + v.price * v.amount, 0)

    const discountedPrice = (): number => {
        let price = totalPrice()

        if (selectedCoupon === fixAmountCoupon.name) {
            price = fixAmountCoupon(price, couponDiscountAmount)
        }
        else if (selectedCoupon === percentageDiscountCoupon.name) {
            price = percentageDiscountCoupon(price, couponDiscountPercentage)
        }

        if (selectedOnTop === percentageDiscountByItemCategoryOnTop.name) {
            price = percentageDiscountByItemCategoryOnTop(price, itemList, onTopCategory, onTopDiscountPercentage)
        }
        else if (selectedOnTop === discountByPointsOnTop.name) {
            price = discountByPointsOnTop(price, onTopCustomerPoints)
        }

        if (selectedSeasonal === specialCampaignsSeasonal.name) {
            price = specialCampaignsSeasonal(price, seasonalEveryAmount, seasonalDiscountAmount)
        }

        return price
    }

    return (
        <div>

            <div>
                <div>Add Item</div>
                <input type='text' value={itemName} onChange={e => setItemName(e.target.value)} placeholder='Name'/>
                <input type='number' value={itemPrice} onChange={e => setItemPrice(parseInt(e.target.value))} min='1' placeholder='Price'/>
                <input type='number' value={itemAmount} onChange={e => setItemAmount(parseInt(e.target.value))} min='1' placeholder='Amount'/>

                <select value={itemCategory} onChange={e => setItemCategory(e.target.value)}>
                    <option>N/A</option>
                    {categoryList.map(type => <option value={type}>{type}</option>)}
                </select>

                <input type='button' value='Add' onClick={addItem} />
            </div>

            <div>
                <div>Cart(s)</div>
                {itemList.map(item => <div>
                    <div>{item.name}</div>
                    <div>{item.price} THB</div>
                    <div>x{item.amount}</div>
                    <div>{item.category}</div>
                </div>)}
            </div>

            <div>
                <div>Add Category</div>
                    <input type='text' value={newCategory} onChange={e => setNewCategory(e.target.value)} />
                    <input type='button' value='Add Category' onClick={addCategory} />
            </div>

            <div>
                <div>Discount Campaigns</div>
                <div>
                    <div>Coupon</div>
                    <div>
                        <label>
                            <input
                            type="radio"
                            value=''
                            checked={selectedCoupon === ''}
                            onChange={() => setSelectedCoupon('')}
                            />
                            None
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                            type="radio"
                            value={fixAmountCoupon.name}
                            checked={selectedCoupon === fixAmountCoupon.name}
                            onChange={() => setSelectedCoupon(fixAmountCoupon.name)}
                            />
                            Fixed Amount Discount
                        </label>
                        <input type='number' value={couponDiscountAmount} onChange={e => setCouponDiscountAmount(parseInt(e.target.value))} min='1' placeholder='Amount THB'/>
                    </div>
                    <div>
                        <label>
                            <input
                            type="radio"
                            value={percentageDiscountCoupon.name}
                            checked={selectedCoupon === percentageDiscountCoupon.name}
                            onChange={() => setSelectedCoupon(percentageDiscountCoupon.name)}
                            />
                            Percentage Discount
                        </label>
                        <input type='number' value={couponDiscountPercentage} onChange={e => setCouponDiscountPercentage(parseInt(e.target.value))} min='1' max='100' placeholder='Percentage'/>
                    </div>
                </div>

                <div>
                    <div>On Top</div>
                    <div>
                        <label>
                            <input
                            type="radio"
                            value=''
                            checked={selectedOnTop === ''}
                            onChange={() => setSelectedOnTop('')}
                            />
                            None
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                            type="radio"
                            value={percentageDiscountByItemCategoryOnTop.name}
                            checked={selectedOnTop === percentageDiscountByItemCategoryOnTop.name}
                            onChange={() => setSelectedOnTop(percentageDiscountByItemCategoryOnTop.name)}
                            />
                            Percentage Discount by Item Category
                        </label>
                        <select value={onTopCategory} onChange={e => setOnTopCategory(e.target.value)}>
                            {categoryList.map(type => <option value={type}>{type}</option>)}
                        </select>
                        <input type='number' value={onTopDiscountPercentage} onChange={e => setOnTopDiscountPercentage(parseInt(e.target.value))} min='1' max='100' placeholder='Percentage'/>
                    </div>
                    <div>
                        <label>
                            <input
                            type="radio"
                            value={discountByPointsOnTop.name}
                            checked={selectedOnTop === discountByPointsOnTop.name}
                            onChange={() => setSelectedOnTop(discountByPointsOnTop.name)}
                            />
                            Discount by Points
                        </label>
                        <input type='number' value={onTopCustomerPoints} onChange={e => setOnTopCustomerPoints(parseInt(e.target.value))} min='1' placeholder='Points'/>
                    </div>
                </div>

                <div>
                    <div>Seasonal</div>
                    <div>
                        <label>
                            <input
                            type="radio"
                            value=''
                            checked={selectedSeasonal === ''}
                            onChange={() => setSelectedSeasonal('')}
                            />
                            None
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                            type="radio"
                            value={specialCampaignsSeasonal.name}
                            checked={selectedSeasonal === specialCampaignsSeasonal.name}
                            onChange={() => setSelectedSeasonal(specialCampaignsSeasonal.name)}
                            />
                            Special campaigns
                        </label>
                        <input type='number' value={seasonalEveryAmount} onChange={e => setSeasonalEveryAmount(parseInt(e.target.value))} min='1' placeholder='Every THB'/>
                        <input type='number' value={seasonalDiscountAmount} onChange={e => setSeasonalDiscountAmount(parseInt(e.target.value))} min='1' placeholder='Discount THB'/>
                    </div>
                </div>
            </div>

            <div>Total Price: {totalPrice()}</div>
            {discountedPrice() < totalPrice() && <div>Discounted Price: {discountedPrice()}</div>}
            

        </div>
    );
}

export default App;
