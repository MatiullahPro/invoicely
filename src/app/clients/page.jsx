"use client";

import React, { useState, useEffect } from "react";
import { UserPlus, Search, Trash2, Edit2, Save, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import Pagination from "@/components/Pagination";

export default function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [newClient, setNewClient] = useState({ name: "", address: "", phone: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const saved = localStorage.getItem("billing_clients");
        if (saved) setClients(JSON.parse(saved));
    }, []);

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const saveClients = (updated) => {
        setClients(updated);
        localStorage.setItem("billing_clients", JSON.stringify(updated));
    };

    const addClient = () => {
        if (!newClient.name) return;
        const updated = [...clients, { ...newClient, id: Date.now() }];
        saveClients(updated);
        setNewClient({ name: "", address: "", phone: "" });
    };

    const deleteClient = (id) => {
        if (confirm("Delete this client?")) {
            saveClients(clients.filter(c => c.id !== id));
        }
    };

    const startEdit = (client) => {
        setEditingId(client.id);
        setNewClient({ ...client });
    };

    const updateClient = () => {
        const updated = clients.map(c => c.id === editingId ? { ...newClient, id: editingId } : c);
        saveClients(updated);
        setEditingId(null);
        setNewClient({ name: "", address: "", phone: "" });
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.address.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedClients = filteredClients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="container px-4 md:px-8 max-w-7xl mx-auto mt-6 md:mt-10 mb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Client Directory</h1>
                    <p className="text-muted-foreground text-sm">Manage your customer database for quick billing</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search clients..."
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
                        {editingId ? <><Edit2 className="h-5 w-5 text-primary" /> Edit Client</> : <><UserPlus className="h-5 w-5 text-primary" /> Add New Client</>}
                    </h2>
                    <div className="space-y-4">
                        <FloatingLabelInput label="Full Name" value={newClient.name} onChange={e => setNewClient({ ...newClient, name: e.target.value })} />
                        <FloatingLabelInput label="Phone" value={newClient.phone} onChange={e => setNewClient({ ...newClient, phone: e.target.value })} />
                        <textarea
                            placeholder="Address"
                            className="w-full p-4 border rounded-xl bg-background min-h-[100px] focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                            value={newClient.address}
                            onChange={e => setNewClient({ ...newClient, address: e.target.value })}
                        ></textarea>
                        <div className="flex gap-2">
                            <Button className="flex-1 h-12 rounded-xl shadow-lg shadow-primary/20" onClick={editingId ? updateClient : addClient}>
                                {editingId ? "Update Client" : "Save Client"}
                            </Button>
                            {editingId && (
                                <Button variant="outline" className="h-12 w-12 rounded-xl" onClick={() => { setEditingId(null); setNewClient({ name: "", address: "", phone: "" }); }}>
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    {paginatedClients.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/20">
                            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <p className="text-muted-foreground font-medium">No clients found</p>
                        </div>
                    ) : (
                        paginatedClients.map(client => (
                            <div key={client.id} className="group p-4 sm:p-6 border rounded-2xl bg-card hover:shadow-md transition-all flex justify-between items-start gap-4">
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg sm:text-xl uppercase flex-shrink-0">
                                        {client.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-base sm:text-lg truncate">{client.name}</h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground">{client.phone}</p>
                                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2 sm:line-clamp-none">{client.address}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-9 w-9 border sm:border-transparent rounded-lg" onClick={() => startEdit(client)}>
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:bg-destructive/10 border sm:border-transparent rounded-lg" onClick={() => deleteClient(client.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}

                    <Pagination
                        totalItems={filteredClients.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
}
