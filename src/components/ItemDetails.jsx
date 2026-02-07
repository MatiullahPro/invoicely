"use client";

import React from 'react';
import FloatingLabelInput from './FloatingLabelInput';
import { Trash2, Percent } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { formatCurrency, getCurrencySymbol } from '../utils/formatCurrency.js';
import { useRouter } from 'next/navigation';

const ItemDetails = ({ items, handleItemChange, addItem, removeItem, currencyCode: propCurrencyCode }) => {
  const router = useRouter();
  let currencyCode = propCurrencyCode;
  if (!currencyCode) {
    currencyCode = 'INR';
  }
  const currencySymbol = getCurrencySymbol(currencyCode);

  return (
    <div className="mb-6">
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="p-4 sm:p-6 border rounded-2xl bg-card/50 relative group transition-all hover:border-primary/30 shadow-sm">
            <div className="flex items-center gap-2 mb-4 md:hidden">
              <span className="text-xs font-black text-muted-foreground bg-muted w-6 h-6 rounded-full flex items-center justify-center">{index + 1}</span>
              <span className="text-sm font-bold">Item {index + 1}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="hidden md:col-span-1 md:flex items-center justify-center">
                <span className="text-xs font-black text-muted-foreground bg-muted w-6 h-6 rounded-full flex items-center justify-center">{index + 1}</span>
              </div>

              <div className="md:col-span-5">
                <FloatingLabelInput
                  id={`itemName${index}`}
                  label="Item Name / Description"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  className="bg-background"
                />
              </div>

              <div className="grid grid-cols-2 md:contents gap-4">
                <div className="md:col-span-2">
                  <FloatingLabelInput
                    id={`itemQuantity${index}`}
                    label="Qty"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                    className="bg-background text-center font-bold"
                  />
                </div>

                <div className="md:col-span-2 relative">
                  <FloatingLabelInput
                    id={`itemAmount${index}`}
                    label={`Price (${currencySymbol})`}
                    type="number"
                    value={item.amount}
                    onChange={(e) => handleItemChange(index, 'amount', parseFloat(e.target.value))}
                    className="bg-background font-bold pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => router.push(`/tools?amount=${item.amount}`)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all md:block hidden"
                    title="Calculate Tax"
                  >
                    <Percent className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col justify-center px-4 py-2 bg-primary/5 rounded-xl border border-primary/10">
                <span className="text-[10px] font-black uppercase text-muted-foreground">Total</span>
                <span className="font-black text-primary">{formatCurrency(item.quantity * item.amount, currencyCode)}</span>
              </div>
            </div>

            <FloatingLabelInput
              id={`itemDescription${index}`}
              label="Extra Description (Optional)"
              value={item.description}
              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
              className="mt-4 bg-background/50 h-10 text-xs"
            />

            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 bg-background border shadow-sm text-destructive opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-8 w-8"
              onClick={() => removeItem(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          type="button"
          onClick={addItem}
          variant="outline"
          className="w-full sm:w-auto border-dashed border-2 py-6 px-10 rounded-2xl hover:bg-primary/5 hover:border-primary/50 transition-all gap-2"
        >
          Add Line Item
        </Button>
      </div>

      {items.length === 0 && (
        <div className="bg-muted/20 border-2 border-dashed rounded-3xl p-12 text-center">
          <p className="text-muted-foreground font-medium">No items added yet. Start by adding a product or service.</p>
          <Button type="button" onClick={addItem} variant="outline" className="mt-4">Add First Item</Button>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;
