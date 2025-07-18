import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import axios from "../api";
import styles from "../styles/AdminDashboard.module.css";

type Product = {
  _id: string;
  name: string;
  category:
    | "laptop"
    | "keyboard"
    | "mouse"
    | "monitor"
    | "headset"
    | "console"
    | "accessory"
    | "graphics card"
    | "controller"
    | "cpu"
    | "motherboard"
    | "ram"
    | "cooling system"
    | "pc case"
    | "psu"
    | "storage"
    | "streaming gear"
    | "gaming chair"
    | "vr"
    | "networking"
    | "capture card"
    | "software"
    | "bundle"
    | "other";
  brand?: string;
  description: string;
  price: number;
  quantity: number;
  specs?: string;
};

type ProductForm = {
  name: string;
  category: Product["category"];
  brand: string;
  description: string;
  price: string;
  quantity: string;
  specs: string;
};

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    category: "laptop",
    brand: "",
    description: "",
    price: "",
    quantity: "",
    specs: ""
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<ProductForm>({
    name: "",
    category: "laptop",
    brand: "",
    description: "",
    price: "",
    quantity: "",
    specs: ""
  });

  const navigate = useNavigate();
  const { currentUser } = useGlobal();

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      alert("Access denied");
      navigate("/login");
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await axios.get("/products");
        setProducts(res.data);
      } catch (err) {
        alert("Failed to fetch products");
      }
    };

    fetchProducts();
  }, [currentUser, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" && value === "" ? "" : value
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setEditData({
      ...editData,
      [name]: type === "number" && value === "" ? "" : value
    });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: formData.price === "" ? 0 : Number(formData.price),
        quantity: formData.quantity === "" ? 0 : Number(formData.quantity)
      };
      const res = await axios.post("/products", payload);
      setProducts([...products, res.data]);
      alert("Product added!");
      setFormData({ name: "", category: "laptop", brand: "", description: "", price: "", quantity: "", specs: "" });
    } catch {
      alert("Error adding product");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch {
      alert("Failed to delete");
    }
  };

  const handleEdit = (product: Product) => {
    setEditId(product._id);
    setEditData({
      name: product.name,
      category: product.category,
      brand: product.brand || "",
      description: product.description,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      specs: product.specs || ""
    });
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...editData,
        price: editData.price === "" ? 0 : Number(editData.price),
        quantity: editData.quantity === "" ? 0 : Number(editData.quantity)
      };
      const res = await axios.put(`/products/${editId}`, payload);
      setProducts(products.map((p) => (p._id === editId ? res.data : p)));
      setEditId(null);
      alert("Product updated!");
    } catch {
      alert("Failed to update");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Admin Dashboard</h2>

      <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>Add Product</h3>
      <form onSubmit={handleAddProduct} className={styles.form}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className={styles.input} />
        <select name="category" value={formData.category} onChange={handleChange} className={styles.input}>
          <option value="laptop">Laptop</option>
          <option value="keyboard">Keyboard</option>
          <option value="mouse">Mouse</option>
          <option value="monitor">Monitor</option>
          <option value="headset">Headset</option>
          <option value="console">Console</option>
          <option value="accessory">Accessory</option>
          <option value="graphics card">Graphics Card</option>
          <option value="controller">Controller</option>
          <option value="cpu">CPU</option>
          <option value="motherboard">Motherboard</option>
          <option value="ram">RAM</option>
          <option value="cooling system">Cooling System</option>
          <option value="pc case">PC Case</option>
          <option value="psu">PSU</option>
          <option value="storage">Storage</option>
          <option value="streaming gear">Streaming Gear</option>
          <option value="gaming chair">Gaming Chair</option>
          <option value="vr">VR</option>
          <option value="networking">Networking</option>
          <option value="capture card">Capture Card</option>
          <option value="software">Software</option>
          <option value="bundle">Bundle</option>
          <option value="other">Other</option>
        </select>
        <input name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" className={styles.input} />
        <input name="specs" value={formData.specs} onChange={handleChange} placeholder="Specs (optional)" className={styles.input} />
        <input name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className={styles.input} />
        <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" required className={styles.input} />
        <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} placeholder="Quantity" required className={styles.input} />
        <button type="submit" className={styles.buttonAdd}>Add</button>
      </form>

      <h3 style={{ marginTop: "2rem" }}>Products</h3>
      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product._id} className={styles.card}>
            {editId === product._id ? (
              <>
                <input name="name" value={editData.name} onChange={handleEditChange} className={styles.input} />
                <select name="category" value={editData.category} onChange={handleEditChange} className={styles.input}>
                  <option value="laptop">Laptop</option>
                  <option value="keyboard">Keyboard</option>
                  <option value="mouse">Mouse</option>
                  <option value="monitor">Monitor</option>
                  <option value="headset">Headset</option>
                  <option value="console">Console</option>
                  <option value="accessory">Accessory</option>
                  <option value="graphics card">Graphics Card</option>
                  <option value="controller">Controller</option>
                  <option value="cpu">CPU</option>
                  <option value="motherboard">Motherboard</option>
                  <option value="ram">RAM</option>
                  <option value="cooling system">Cooling System</option>
                  <option value="pc case">PC Case</option>
                  <option value="psu">PSU</option>
                  <option value="storage">Storage</option>
                  <option value="streaming gear">Streaming Gear</option>
                  <option value="gaming chair">Gaming Chair</option>
                  <option value="vr">VR</option>
                  <option value="networking">Networking</option>
                  <option value="capture card">Capture Card</option>
                  <option value="software">Software</option>
                  <option value="bundle">Bundle</option>
                  <option value="other">Other</option>
                </select>
                <input name="brand" value={editData.brand} onChange={handleEditChange} className={styles.input} />
                <input name="specs" value={editData.specs} onChange={handleEditChange} className={styles.input} />
                <input name="description" value={editData.description} onChange={handleEditChange} className={styles.input} />
                <input name="price" type="number" value={editData.price} onChange={handleEditChange} className={styles.input} />
                <input name="quantity" type="number" value={editData.quantity} onChange={handleEditChange} className={styles.input} />
                <button onClick={handleSave} className={styles.buttonEdit}>Save</button>
                <button onClick={() => setEditId(null)} className={styles.buttonCancel}>Cancel</button>
              </>
            ) : (
              <>
                <h4>{product.name}</h4>
                <p>Category: {product.category}</p>
                {product.brand && <p>Brand: {product.brand}</p>}
                <p>{product.description}</p>
                {product.specs && <p>Specs: {product.specs}</p>}
                <p>${product.price}</p>
                <p>Qty: {product.quantity}</p>
                <button onClick={() => handleEdit(product)} className={styles.buttonEdit}>Edit</button>
                <button onClick={() => handleDelete(product._id)} className={styles.buttonDelete}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
