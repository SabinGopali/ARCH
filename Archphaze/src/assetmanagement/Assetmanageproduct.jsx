import React, { useState } from "react";
import { FiChevronDown, FiMoreVertical, FiEye } from "react-icons/fi";
import AssetSidebar from "./AssetSidebar";

const sampleProducts = [
  {
    id: 1,
    name: "Droop Shoulder",
    type: "T-shirt",
    idNumber: "GD36457",
    uploaded: "24 Jan 2025",
    stock: "50/100",
    variation: "005",
    status: true,
    price: 120.5,
    image: "https://dummyimage.com/50x50/ccc/000.png&text=DS",
  },
  {
    id: 2,
    name: "T-shirt Slim-fit",
    type: "Tshirt",
    idNumber: "GD36457",
    uploaded: "24 Jan 2025",
    stock: "50/100",
    variation: "005",
    status: true,
    price: 120.5,
    image: "https://dummyimage.com/50x50/ccc/000.png&text=TS",
  },
  {
    id: 3,
    name: "Winter Hoodie",
    type: "Hoodie",
    idNumber: "GD36457",
    uploaded: "24 Jan 2025",
    stock: "50/100",
    variation: "005",
    status: true,
    price: 120.5,
    image: "https://dummyimage.com/50x50/ccc/000.png&text=WH",
  },
  {
    id: 4,
    name: "Casual Hoodie",
    type: "Hoodie",
    idNumber: "GD36457",
    uploaded: "24 Jan 2025",
    stock: "50/100",
    variation: "005",
    status: true,
    price: 120.5,
    image: "https://dummyimage.com/50x50/ccc/000.png&text=CH",
  },
  {
    id: 5,
    name: "Printed Hoodie",
    type: "Hoodie",
    idNumber: "GD36457",
    uploaded: "24 Jan 2025",
    stock: "50/100",
    variation: "005",
    status: false,
    price: 120.5,
    image: "https://dummyimage.com/50x50/ccc/000.png&text=PH",
  },
];

export default function Assetmanageproduct() {
  const [products, setProducts] = useState(sampleProducts);

  const toggleStatus = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: !p.status } : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r shadow-sm">
        <AssetSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <button className="px-3 py-2 bg-white border rounded-md shadow-sm flex items-center gap-2">
            Show : All Products <FiChevronDown />
          </button>
          <button className="px-3 py-2 bg-white border rounded-md shadow-sm flex items-center gap-2">
            Show Price: $100-$120 <FiChevronDown />
          </button>
          <button className="px-3 py-2 bg-white border rounded-md shadow-sm flex items-center gap-2">
            Show : All Status <FiChevronDown />
          </button>
          <button className="ml-auto px-3 py-2 bg-white border rounded-md shadow-sm">
            Sort by
          </button>
          <button className="px-3 py-2 bg-white border rounded-md shadow-sm">
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3">
                  <input type="checkbox" className="w-4 h-4" />
                </th>
                <th className="px-4 py-3">Product List</th>
                <th className="px-4 py-3">ID Number</th>
                <th className="px-4 py-3">Last Uploaded</th>
                <th className="px-4 py-3">In Stocks</th>
                <th className="px-4 py-3">Variation</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" className="w-4 h-4" />
                  </td>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-gray-500 text-xs">{p.type}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">{p.idNumber}</td>
                  <td className="px-4 py-3">{p.uploaded}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: "50%" }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{p.stock}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{p.variation}</td>
                  <td className="px-4 py-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={p.status}
                        onChange={() => toggleStatus(p.id)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 relative after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </td>
                  <td className="px-4 py-3 font-medium">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <FiEye />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <FiMoreVertical />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
