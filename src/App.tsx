import React, { useState } from 'react';
import './App.css';
import Item from './models/items';
import { discountByPointsOnTop, fixAmountCoupon, percentageDiscountByItemCategoryOnTop, percentageDiscountCoupon, specialCampaignsSeasonal } from './utils/discount';

function App() {
    const [itemList, setItemList] = useState<Item[]>([])
    const [categoryList, setCategoryList] = useState<string[]>([])

    const [itemName, setItemName] = useState('')
    const [itemPrice, setItemPrice] = useState(0)
    const [itemAmount, setItemAmount] = useState(1)
    const [itemCategory, setItemCategory] = useState('')

    const [newCategory, setNewCategory] = useState('')

    const [selectedCoupon, setSelectedCoupon] = useState('')
    const [selectedOnTop, setSelectedOnTop] = useState('')
    const [selectedSeasonal, setSelectedSeasonal] = useState('')

    const addItem = (name: string, price: number, amount: number, category: string) => {
        if (itemName.length <= 0 || price < 0 || amount < 1 || category.length <= 0) {
            return
        }
        const item = new Item(name, price, amount, category)
        setItemList([...itemList, item])
        setItemName('')
        setItemPrice(0)
        setItemAmount(1)
        setItemCategory('')
    }

    const addCategory = (category: string) => {
        if (category.length <= 0) {
            return
        }
        setCategoryList([category, ...categoryList])
    }

    return (
        <div>

            <div>
                <div>Add Item</div>
                <input type='text' value={itemName} onChange={e => setItemName(e.target.value)} />
                <input type='number' value={itemPrice} onChange={e => setItemPrice(parseInt(e.target.value))} min='0' />
                <input type='number' value={itemAmount} onChange={e => setItemAmount(parseInt(e.target.value))} min='1' />

                <select value={itemCategory} onChange={e => setItemCategory(e.target.value)}>
                    <option>- None -</option>
                    {categoryList.map(type => <option value={type}>{type}</option>)}
                </select>

                <input type='button' value='Add' onClick={() => addItem(itemName, itemPrice, itemAmount, itemCategory)} />
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
                    <input type='button' value='Add Category' onClick={() => addCategory(newCategory)} />
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
                            Fixed Amount
                        </label>
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
                    </div>
                </div>
            </div>

        </div>
    );
}

export default App;
