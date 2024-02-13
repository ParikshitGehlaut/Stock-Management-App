"use client";
import Header from "./components/Header";
import { useState, useEffect } from "react";
import Image from "next/image";
export default function Home() {
  // Sample product data, replace with your actual data

  const [productForm, setproductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingaction, setLoadingaction] = useState(false);
  const [query, setQuery] = useState("");
  const [dropdown, setDropdown] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product", {
          method: "GET",
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let rjson = await response.json();
        // console.log(rjson);
        setProducts(rjson.products);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the /api/products endpoint
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productForm),
      });
      if (response.ok) {
        // console.log("Product added successfully!");
        setAlert("Your Product has been added");
        setTimeout(() => {
          setAlert("");
        }, 5000);
        setproductForm({});
      } else {
        console.log("Failed to add product:", response.statusText);
      }
    } catch (error) {
      console.log("Error adding product:", error.message);
    }
  };

  const handleChange = (e) => {
    setproductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const onDropDownEdit = async (e) => {
    let inputValue = e.target.value;
    setQuery(e.target.value);
    // console.log(query);
    setLoading(true);
    setDropdown([]);
    try {
      const response = await fetch("/api/search?query=" + inputValue);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const res = await response.json();
      // console.log(res);
      if (res && res.products) {
        setLoading(false);
        setDropdown(res.products);
      } else {
        console.error("Invalid response format:", res);
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error.message);
    }
  };

  const buttonAction = async (action, slug, initialQuantity) => {
    setLoadingaction(true);
    // Send a POST request to the /api/action endpoint
    const response = await fetch("/api/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(action, slug, initialQuantity),
    });
    let r = await response.json();
    console.log(r);
    setLoadingaction(false);
  };

  return (
    <>
      <Header />
      <div className="text-center font-semibold bg-green-400 text-white">
        {alert}
      </div>
      <div className="container  mx-4 py-2 px-3">
        {/* Search section */}
        <div className="mb-1 mx-2 p-4">
          <h1 className="text-3xl text-center font-semibold my-2 ">
            Search a Product
          </h1>
          <div className="flex items-center">
            <input
              className="shadow appearance-none border rounded w-4/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="searchProduct"
              onBlur={() => {
                setDropdown([]);
              }}
              onChange={onDropDownEdit}
              type="text"
              placeholder="Search for a product"
            />
            {/* Dropdown menu for search options */}
            <select
              className="ml-2 appearance-none border rounded w-1/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="searchOption"
            >
              <option value="">All</option>
              <option value="productName">Product Name</option>
              <option value="quantity">Quantity</option>
              <option value="price">Price</option>
            </select>
          </div>
          {loading && (
            <div className="container flex justify-center align-top">
              <Image src="/loading.gif" alt="" height={50} width={50} />
            </div>
          )}
          <div className="dropcontainer absolute w-[72vw] rounded-md bg-purple-100">
            {dropdown.map((item) => {
              return (
                <div
                  className="container flex justify-between border rounded px-3 py-2"
                  key={item.slug}
                >
                  <span className="info">
                    {item.slug}({item.quantity} available for ₹{item.price})
                  </span>
                  <div className="mx-5">
                    <button
                      onClick={() => {
                        buttonAction("plus", item.slug, item.quantity);
                      }}
                      disabled={loadingaction}
                      className="add px-3 inline-block py-1 font-semibold text-white shadow-md bg-purple-500 rounded-lg cursor-pointer disabled:bg-purple-200"
                    >
                      -
                    </button>
                    <span className="quantity mx-3 inline-block w-3">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => {
                        buttonAction("minus", item.slug, item.quantity);
                      }}
                      disabled={loadingaction}
                      className="subtract px-3 inline-block py-1 font-semibold text-white shadow-md bg-purple-500 rounded-lg cursor-pointer disabled:bg-purple-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Input fields for adding a new product */}
        <h1 className="mt-2 text-center text-3xl font-semibold mb-1">
          Add a Product
        </h1>
        <div className="mb-4 mx-2">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="slug"
          >
            Product Slug:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleChange}
            value={productForm?.slug || ""}
            id="slug"
            name="slug"
            type="text"
            placeholder="Enter product name"
          />
        </div>

        <div className="mb-4 mx-2">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="quantity"
          >
            Quantity:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleChange}
            value={productForm?.quantity || ""}
            name="quantity"
            id="quantity"
            type="number"
            placeholder="Enter quantity"
          />
        </div>

        <div className="mb-4 mx-2">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="price"
          >
            Price:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleChange}
            value={productForm?.price || ""}
            name="price"
            id="price"
            type="number"
            placeholder="Enter price"
          />
        </div>

        {/* Button to add the product (you can handle this button click event) */}
        <button
          onClick={addProduct}
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-2"
        >
          Add Product
        </button>
      </div>

      <div className="container mx-4 mt-3 p-4">
        <h1 className=" text-center text-3xl font-semibold mb-2">
          Display Current Stock
        </h1>
        {/* Table to display products */}
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Product Name</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Price</th>
              {/* Add more headers as needed */}
            </tr>
          </thead>
          <tbody>
            {/* Example data, replace this with your actual product data */}

            {products.map((product) => (
              <tr key={product.slug}>
                <td className="border px-4 py-2 text-center">{product.slug}</td>
                <td className="border px-4 py-2 text-center">
                  {product.quantity}
                </td>
                <td className="border px-4 py-2 text-center">
                  ₹{product.price}
                </td>
                {/* Add more columns if needed */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
