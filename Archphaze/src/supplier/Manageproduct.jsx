import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Suppliersidebar from "./Suppliersidebar";

export default function ManageProduct() {
  const { currentUser } = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    outOfStock: false,
    inStock: false,
    warrantyOnly: false,
    hasVariants: false,
  });
  const navigate = useNavigate();

  const isSubUser = Boolean(currentUser?.isSubUser);
  const subUserRole = currentUser?.role || "";
  const canDelete = !isSubUser || subUserRole === "Full Supplier Access";
  const canModify = !isSubUser || subUserRole !== "View Only";
  const canAdd = !isSubUser || subUserRole !== "View Only";

  useEffect(() => {
    const fetchProducts = async () => {
      const supplierOwnerId = isSubUser
        ? currentUser?.supplierId || currentUser?.supplierRef
        : currentUser?._id;
      if (!supplierOwnerId) return;
      try {
        const res = await fetch(`/backend/user/product/${supplierOwnerId}`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentUser?._id, isSubUser, currentUser?.supplierId, currentUser?.supplierRef]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOutOfStock = !filters.outOfStock || product.stock === 0;
    const matchesInStock = !filters.inStock || product.stock > 0;
    const matchesWarranty = !filters.warrantyOnly || !!product.warranty?.type;
    const matchesVariants = !filters.hasVariants || (product.variants?.length > 0);

    return (
      matchesSearch &&
      matchesOutOfStock &&
      matchesInStock &&
      matchesWarranty &&
      matchesVariants
    );
  });

  const handleDelete = async (product) => {
    if (!canDelete) return;
    if (window.confirm(`Are you sure you want to delete "${product.productName}"?`)) {
      try {
        const res = await fetch(`/backend/product/delete/${product._id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          setProducts((prev) => prev.filter((p) => p._id !== product._id));
          setSelectedProducts((prev) => prev.filter((id) => id !== product._id));
          alert(`${product.productName} deleted successfully!`);
        } else {
          alert("Failed to delete the product.");
        }
      } catch {
        alert("An error occurred while deleting the product.");
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (!canDelete) return;
    if (
      selectedProducts.length === 0 ||
      !window.confirm(`Are you sure you want to delete ${selectedProducts.length} product(s)?`)
    )
      return;

    for (const productId of selectedProducts) {
      try {
        const res = await fetch(`/backend/product/delete/${productId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error();
        setProducts((prev) => prev.filter((p) => p._id !== productId));
      } catch {
        console.error(`Failed to delete product with ID: ${productId}`);
      }
    }

    setSelectedProducts([]);
    alert("Selected products deleted successfully.");
  };

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p._id));
    }
  };

  const handleModify = (product) => {
    if (!canModify) return;
    navigate(`/updateproduct/${product._id}`);
  };

  const handleToggleAvailability = async (product) => {
    if (!canModify) return;
    const newValue = !product.available;

    setProducts((prev) =>
      prev.map((p) => (p._id === product._id ? { ...p, available: newValue } : p))
    );

    try {
      const res = await fetch(`/backend/product/update/${product._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ available: newValue }),
      });
      if (!res.ok) throw new Error("Failed to update availability");
    } catch (err) {
      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? { ...p, available: product.available } : p))
      );
      alert("Could not update availability. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-10">
      <div className="px-4 lg:hidden mb-5">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white border shadow rounded-md hover:bg-gray-100 transition"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 lg:flex lg:gap-8">
        <aside className="w-full lg:w-64 mb-10 lg:mb-0">
          <Suppliersidebar />
        </aside>

        <main className="flex-1">
          <section className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Manage Products</h2>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={handleDeleteSelected}
                  disabled={!canDelete || selectedProducts.length === 0}
                  className={`border text-sm px-4 py-2.5 rounded-md shadow ${
                    !canDelete || selectedProducts.length === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => navigate("/addproduct")}
                  disabled={!canAdd}
                  className={`text-sm px-5 py-2.5 rounded-md shadow border ${
                    canAdd
                      ? "bg-white text-black border-black hover:bg-black hover:text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                  }`}
                >
                  + Add Product
                </button>
              </div>
            </div>

            <hr className="mb-4" />

            <div className="mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by SKU..."
                className="w-full sm:w-80 border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-700">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.outOfStock}
                  onChange={() => setFilters((prev) => ({ ...prev, outOfStock: !prev.outOfStock }))}
                />
                Out of Stock
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={() => setFilters((prev) => ({ ...prev, inStock: !prev.inStock }))}
                />
                In Stock
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.warrantyOnly}
                  onChange={() => setFilters((prev) => ({ ...prev, warrantyOnly: !prev.warrantyOnly }))}
                />
                Warranty Only
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.hasVariants}
                  onChange={() => setFilters((prev) => ({ ...prev, hasVariants: !prev.hasVariants }))}
                />
                Has Variants
              </label>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full text-sm text-left text-gray-800">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
                  <tr>
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          selectedProducts.length === filteredProducts.length &&
                          filteredProducts.length > 0
                        }
                        disabled={!canDelete}
                      />
                    </th>
                    <th className="px-4 py-3 whitespace-nowrap">Product Name</th>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Warranty</th>
                    <th className="px-4 py-3">Variants</th>
                    <th className="px-4 py-3">Managed By</th>
                    <th className="px-4 py-3">Availability</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-6 text-gray-500">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => {
                      let imageUrl = product.images?.[0] || "";
                      imageUrl = imageUrl.replace(/\\/g, "/");
                      if (!imageUrl.startsWith("http")) {
                        imageUrl = `http://localhost:3000/${imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl}`;
                      }

                      const variantsStr = product.variants?.map((v) => v.name).join(", ") || "-";

                      return (
                        <tr key={product._id} className="hover:bg-gray-50 transition text-sm">
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product._id)}
                              onChange={() => handleCheckboxChange(product._id)}
                              disabled={!canDelete}
                            />
                          </td>
                          <td className="px-4 py-4 flex items-center gap-3 min-w-[180px]">
                            <img
                              src={imageUrl}
                              alt={product.productName}
                              className="w-16 h-16 object-contain rounded border"
                            />
                            <span className="font-medium text-gray-800">{product.productName}</span>
                          </td>
                          <td className="px-4 py-4">{product.sku || "-"}</td>
                          <td className="px-4 py-4">{product.stock}</td>
                          <td className="px-4 py-4">{product.warranty?.type || "No"}</td>
                          <td className="px-4 py-4">{variantsStr}</td>
                          <td className="px-4 py-4">
                            {product.managedBy || currentUser?.name || currentUser?.username || "You"}
                          </td>
                          <td className="px-4 py-4">
                            <label
                              htmlFor={`available-${product._id}`}
                              className={`inline-flex items-center select-none ${canModify ? "cursor-pointer" : "cursor-not-allowed"}`}
                            >
                              <input
                                id={`available-${product._id}`}
                                type="checkbox"
                                checked={!!product.available}
                                onChange={() => handleToggleAvailability(product)}
                                className="sr-only"
                                disabled={!canModify}
                              />
                              <div
                                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
                                  product.available ? "bg-black" : "bg-gray-300"
                                }`}
                              >
                                <div
                                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
                                    product.available ? "translate-x-6" : "translate-x-0"
                                  }`}
                                />
                              </div>
                            </label>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                className={`text-xs border px-3 py-1 rounded ${
                                  canModify
                                    ? "text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-800"
                                    : "text-gray-400 border-gray-300 cursor-not-allowed"
                                }`}
                                onClick={() => handleModify(product)}
                                disabled={!canModify}
                              >
                                Modify
                              </button>
                              <button
                                className={`text-xs border px-3 py-1 rounded ${
                                  canDelete
                                    ? "text-red-600 border-red-600 hover:bg-red-50 hover:text-red-800"
                                    : "text-gray-400 border-gray-300 cursor-not-allowed"
                                }`}
                                onClick={() => handleDelete(product)}
                                disabled={!canDelete}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 pt-4 text-sm text-gray-500 text-right">
              Showing {filteredProducts.length} of {products.length} total {products.length === 1 ? "product" : "products"}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}