import { useState } from 'react';

const WarehouseStocks = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWarehouse, setSelectedWarehouse] = useState('all');
    const [sortBy, setSortBy] = useState('quantity');

    // Static data matching your API response structure
    const warehouseStocksData = {
        success: true,
        message: "Warehouse stocks retrieved successfully",
        data: {
            meta: {
                page: 1,
                limit: 5,
                total: 3,
                totalPage: 1
            },
            warehouseStocks: [
                {
                    "_id": "68fe18ac4ffd35e1774702aa",
                    "warehouse": {
                        "_id": "68fc51bb77269762528f286e",
                        "warehouseId": "0001",
                        "name": "Drew Walter",
                        "address": "Aliquip eum eveniet",
                        "city": "Rajshahi",
                        "manager": "Fugiat esse esse id",
                        "phone": "+1 (324) 626-5135",
                        "type": "",
                        "capacity": 77,
                        "openingDate": "1979-11-21",
                        "status": "active",
                        "note": "Asperiores et qui ve",
                        "createdAt": "2025-10-25T04:27:39.215Z",
                        "updatedAt": "2025-10-26T07:15:07.169Z",
                        "__v": 0
                    },
                    "product": {
                        "_id": "68fc55e377269762528f2950",
                        "product_name": "Audrey Clayton",
                        "product_type": "68fc51c477269762528f2874",
                        "image": "https://res.cloudinary.com/do2cbxkkj/image/upload/v1761367512/Gemini_Generated_Image_nsme4nnsme4nnsme_qncahj.png",
                        "category": "68fc51d477269762528f2880",
                        "suppliers": "68fc54bc77269762528f28d6",
                        "warranties": "68fc555677269762528f2916",
                        "product_code": "600",
                        "brand": "68fc51cd77269762528f287a",
                        "tags": [
                            "Mollitia maxime ut l"
                        ],
                        "unit": "68fc55aa77269762528f2928",
                        "warehouse": "68fc51bb77269762528f286e",
                        "purchasePrice": 900,
                        "expense": 37,
                        "sellingPrice": 1000,
                        "minimumSalePrice": 950,
                        "product_tax": 13,
                        "shipping": 35,
                        "product_quantity": 0,
                        "tax_method": "92",
                        "storageLocation": "Tenetur et et proide",
                        "productStatus": "active",
                        "productDescription": "Velit vitae accusant",
                        "specifications": "Voluptatem iusto nih",
                        "discount": 4,
                        "initialStock": 70,
                        "reorderLevel": 24,
                        "stock_alert": 10,
                        "lastPurchaseDate": "2025-10-25T00:00:00.000Z",
                        "lastSoldDate": "2025-10-25T05:06:49.133Z",
                        "isDeleted": false,
                        "expiryDateType": "fixed",
                        "expiryDate": "2025-10-25",
                        "shelfLife": 0,
                        "expiryAlertDays": 30,
                        "batchNumber": "55",
                        "createdAt": "2025-10-25T04:45:23.349Z",
                        "updatedAt": "2025-10-27T05:22:24.726Z",
                        "__v": 0,
                        "manufacturingDate": null,
                        "shelfLifeUnit": "Days"
                    },
                    "quantity": 50,
                    "createdAt": "2025-10-26T12:48:44.406Z",
                    "updatedAt": "2025-10-27T05:22:18.165Z"
                },
                {
                    "_id": "68fef56a613939cfcd36c729",
                    "warehouse": {
                        "_id": "68fc51bb77269762528f286e",
                        "warehouseId": "0001",
                        "name": "Drew Walter",
                        "address": "Aliquip eum eveniet",
                        "city": "Rajshahi",
                        "manager": "Fugiat esse esse id",
                        "phone": "+1 (324) 626-5135",
                        "type": "",
                        "capacity": 77,
                        "openingDate": "1979-11-21",
                        "status": "active",
                        "note": "Asperiores et qui ve",
                        "createdAt": "2025-10-25T04:27:39.215Z",
                        "updatedAt": "2025-10-26T07:15:07.169Z",
                        "__v": 0
                    },
                    "product": {
                        "_id": "68fdca7baf540151803976a8",
                        "product_name": "New Product",
                        "product_type": "68fc51c477269762528f2874",
                        "image": "https://res.cloudinary.com/do2cbxkkj/image/upload/v1761462851/Gemini_Generated_Image_nsme4nnsme4nnsme_icrjh5.png",
                        "category": "68fc51d477269762528f2880",
                        "suppliers": "68fc54bc77269762528f28d6",
                        "warranties": "68fc555677269762528f2916",
                        "product_code": "655",
                        "brand": "68fc51cd77269762528f287a",
                        "tags": [],
                        "unit": "68fc55a477269762528f291f",
                        "warehouse": "68fc51bb77269762528f286e",
                        "purchasePrice": 800,
                        "expense": 0,
                        "sellingPrice": 900,
                        "minimumSalePrice": 850,
                        "product_tax": 0,
                        "shipping": 0,
                        "product_quantity": 5,
                        "tax_method": "",
                        "storageLocation": "",
                        "productStatus": "",
                        "discount": 0,
                        "initialStock": 0,
                        "reorderLevel": 0,
                        "stock_alert": 20,
                        "lastPurchaseDate": "2025-10-26T00:00:00.000Z",
                        "lastSoldDate": "2025-10-26T09:47:11.425Z",
                        "isDeleted": false,
                        "expiryDateType": "fixed",
                        "expiryDate": "2025-10-26",
                        "shelfLife": null,
                        "expiryAlertDays": 30,
                        "batchNumber": "",
                        "createdAt": "2025-10-26T07:15:07.072Z",
                        "updatedAt": "2025-10-27T08:51:24.549Z",
                        "__v": 0
                    },
                    "quantity": 30,
                    "createdAt": "2025-10-27T04:30:34.504Z",
                    "updatedAt": "2025-10-27T08:50:35.589Z"
                },
                {
                    "_id": "68ff328c3a14c34eed7696cc",
                    "warehouse": {
                        "_id": "68fc7342cd406c073d8f1fb4",
                        "warehouseId": "0002",
                        "name": "Quamar Pitts",
                        "address": "Aliqua Accusantium ",
                        "city": "Dhaka",
                        "manager": "Magnam a officia exp",
                        "phone": "+1 (863) 543-9105",
                        "type": "Secondary Warehouse",
                        "capacity": 800,
                        "openingDate": "1978-10-10",
                        "status": "active",
                        "note": "Dolore animi ea arc",
                        "createdAt": "2025-10-25T06:50:42.277Z",
                        "updatedAt": "2025-10-25T06:50:42.277Z",
                        "__v": 0
                    },
                    "product": {
                        "_id": "68fdca7baf540151803976a8",
                        "product_name": "New Product",
                        "product_type": "68fc51c477269762528f2874",
                        "image": "https://res.cloudinary.com/do2cbxkkj/image/upload/v1761462851/Gemini_Generated_Image_nsme4nnsme4nnsme_icrjh5.png",
                        "category": "68fc51d477269762528f2880",
                        "suppliers": "68fc54bc77269762528f28d6",
                        "warranties": "68fc555677269762528f2916",
                        "product_code": "655",
                        "brand": "68fc51cd77269762528f287a",
                        "tags": [],
                        "unit": "68fc55a477269762528f291f",
                        "warehouse": "68fc51bb77269762528f286e",
                        "purchasePrice": 800,
                        "expense": 0,
                        "sellingPrice": 900,
                        "minimumSalePrice": 850,
                        "product_tax": 0,
                        "shipping": 0,
                        "product_quantity": 5,
                        "tax_method": "",
                        "storageLocation": "",
                        "productStatus": "",
                        "discount": 0,
                        "initialStock": 0,
                        "reorderLevel": 0,
                        "stock_alert": 20,
                        "lastPurchaseDate": "2025-10-26T00:00:00.000Z",
                        "lastSoldDate": "2025-10-26T09:47:11.425Z",
                        "isDeleted": false,
                        "expiryDateType": "fixed",
                        "expiryDate": "2025-10-26",
                        "shelfLife": null,
                        "expiryAlertDays": 30,
                        "batchNumber": "",
                        "createdAt": "2025-10-26T07:15:07.072Z",
                        "updatedAt": "2025-10-27T08:51:24.549Z",
                        "__v": 0
                    },
                    "quantity": 5,
                    "createdAt": "2025-10-27T08:51:24.466Z",
                    "updatedAt": "2025-10-27T08:51:24.466Z"
                }
            ]
        }
    };

    // Filter and sort data
    const filteredStocks = warehouseStocksData.data.warehouseStocks
        .filter(stock => {
            const matchesSearch = stock.product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                stock.product.product_code.includes(searchTerm);
            const matchesWarehouse = selectedWarehouse === 'all' || stock.warehouse._id === selectedWarehouse;
            return matchesSearch && matchesWarehouse;
        })
        .sort((a, b) => {
            if (sortBy === 'quantity') {
                return b.quantity - a.quantity;
            } else if (sortBy === 'name') {
                return a.product.product_name.localeCompare(b.product.product_name);
            } else if (sortBy === 'warehouse') {
                return a.warehouse.name.localeCompare(b.warehouse.name);
            }
            return 0;
        });

    // Get unique warehouses for filter
    const warehouses = [...new Set(warehouseStocksData.data.warehouseStocks.map(stock => stock.warehouse._id))];

    // Calculate summary statistics
    const totalProducts = filteredStocks.length;
    const totalQuantity = filteredStocks.reduce((sum, stock) => sum + stock.quantity, 0);
    const lowStockItems = filteredStocks.filter(stock =>
        stock.quantity <= stock.product.stock_alert
    ).length;

    return (
        <div className="warehouse-stocks">
            <header className="stocks-header">
                <div className="header-content">
                    <h1>StockFlow Dashboard</h1>
                    <p>Manage and monitor your warehouse inventory in real-time</p>
                </div>
                <div className="header-stats">
                    <div className="stat-card">
                        <div className="stat-icon">📦</div>
                        <div className="stat-info">
                            <h3>{totalProducts}</h3>
                            <span>Total Products</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🔢</div>
                        <div className="stat-info">
                            <h3>{totalQuantity}</h3>
                            <span>Total Quantity</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⚠️</div>
                        <div className="stat-info">
                            <h3>{lowStockItems}</h3>
                            <span>Low Stock Alerts</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="controls-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search products by name or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="search-icon">🔍</span>
                </div>

                <div className="filter-controls">
                    <select
                        value={selectedWarehouse}
                        onChange={(e) => setSelectedWarehouse(e.target.value)}
                    >
                        <option value="all">All Warehouses</option>
                        {warehouses.map(warehouseId => {
                            const warehouse = warehouseStocksData.data.warehouseStocks
                                .find(stock => stock.warehouse._id === warehouseId)?.warehouse;
                            return (
                                <option key={warehouseId} value={warehouseId}>
                                    {warehouse?.name} ({warehouse?.warehouseId})
                                </option>
                            );
                        })}
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="quantity">Sort by Quantity</option>
                        <option value="name">Sort by Name</option>
                        <option value="warehouse">Sort by Warehouse</option>
                    </select>
                </div>
            </div>

            <div className="stocks-grid">
                {filteredStocks.map(stock => (
                    <div key={stock._id} className="stock-card">
                        <div className="card-header">
                            <div className="product-image">
                                <img src={stock.product.image} alt={stock.product.product_name} />
                            </div>
                            <div className="product-info">
                                <h3>{stock.product.product_name}</h3>
                                <p className="product-code">Code: {stock.product.product_code}</p>
                                <div className={`stock-badge ${stock.quantity <= stock.product.stock_alert ? 'low-stock' : 'in-stock'}`}>
                                    {stock.quantity <= stock.product.stock_alert ? 'Low Stock' : 'In Stock'}
                                </div>
                            </div>
                        </div>

                        <div className="card-details">
                            <div className="detail-row">
                                <span className="label">Warehouse:</span>
                                <span className="value">{stock.warehouse.name}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Location:</span>
                                <span className="value">{stock.warehouse.city}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Current Stock:</span>
                                <span className={`value quantity ${stock.quantity <= stock.product.stock_alert ? 'low' : ''}`}>
                                    {stock.quantity} units
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Reorder Level:</span>
                                <span className="value">{stock.product.reorderLevel || 'N/A'} units</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Price:</span>
                                <span className="value">${stock.product.sellingPrice}</span>
                            </div>
                        </div>

                        <div className="card-footer">
                            <div className="warehouse-info">
                                <small>Managed by: {stock.warehouse.manager}</small>
                                <small>Capacity: {stock.warehouse.capacity} units</small>
                            </div>
                            <button className="action-btn">View Details</button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredStocks.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>No products found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            )}
        </div>
    );
};

export default WarehouseStocks;