"use client";

import React, { useState, useEffect } from "react";
import { PackagePlus, Search, Trash2, Edit2, Save, X, Box, Tag, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import Pagination from "@/components/Pagination";

export default function InventoryPage() {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [newItem, setNewItem] = useState({ name: "", description: "", price: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const saved = localStorage.getItem("billing_inventory");
        if (saved) setItems(JSON.parse(saved));
    }, []);

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const saveItems = (updated) => {
        setItems(updated);
        localStorage.setItem("billing_inventory", JSON.stringify(updated));
    };

    const addItem = () => {
        if (!newItem.name || !newItem.price) return;
        const updated = [...items, { ...newItem, id: Date.now() }];
        saveItems(updated);
        setNewItem({ name: "", description: "", price: "" });
    };

    const deleteItem = (id) => {
        if (confirm("Delete this product?")) {
            saveItems(items.filter(i => i.id !== id));
        }
    };

    const startEdit = (item) => {
        setEditingId(item.id);
        setNewItem({ ...item });
    };

    const updateItem = () => {
        const updated = items.map(i => i.id === editingId ? { ...newItem, id: editingId } : i);
        saveItems(updated);
        setEditingId(null);
        setNewItem({ name: "", description: "", price: "" });
    };

    const filteredItems = items.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.description.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="container px-4 md:px-8 max-w-7xl mx-auto mt-6 md:mt-10 mb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Product Inventory</h1>
                    <p className="text-muted-foreground text-sm">Manage services and products for faster item entry</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 border rounded-xl bg-background"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1 border rounded-2xl p-6 bg-card h-fit lg:sticky lg:top-24 shadow-sm">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        {editingId ? <><Edit2 className="h-5 w-5 text-primary" /> Edit Product</> : <><PackagePlus className="h-5 w-5 text-primary" /> Add New Product</>}
                    </h2>
                    <div className="space-y-4">
                        <FloatingLabelInput label="Product/Service Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                        <FloatingLabelInput label="Default Price" type="number" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} />
                        <textarea
                            placeholder="Description"
                            className="w-full p-4 border rounded-xl bg-background min-h-[100px] focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                            value={newItem.description}
                            onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                        ></textarea>
                        <div className="flex gap-2">
                            <Button className="flex-1 h-12 rounded-xl shadow-lg shadow-primary/20" onClick={editingId ? updateItem : addItem}>
                                {editingId ? "Update Product" : "Save Product"}
                            </Button>
                            {editingId && (
                                <Button variant="outline" className="h-12 w-12 rounded-xl" onClick={() => { setEditingId(null); setNewItem({ name: "", description: "", price: "" }); }}>
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    {paginatedItems.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/20">
                            <Box className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <p className="text-muted-foreground font-medium">No products found</p>
                        </div>
                    ) : (
                        paginatedItems.map(item => (
                            <div key={item.id} className="group p-4 sm:p-6 border rounded-2xl bg-card hover:shadow-md transition-all flex justify-between items-center gap-4">
                                <div className="flex gap-4 items-center min-w-0">
                                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <Tag className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-base sm:text-lg truncate">{item.name}</h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-6 flex-shrink-0">
                                    <div className="text-right">
                                        <span className="text-[10px] text-muted-foreground block uppercase tracking-tighter font-black">Price</span>
                                        <span className="font-bold text-base sm:text-lg">{item.price}</span>
                                    </div>
                                    <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 border sm:border-transparent rounded-lg" onClick={() => startEdit(item)}>
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 text-destructive hover:bg-destructive/10 border sm:border-transparent rounded-lg" onClick={() => deleteItem(item.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    <Pagination
                        totalItems={filteredItems.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
}
