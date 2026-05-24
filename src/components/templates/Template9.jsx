import React from 'react';
import { format } from 'date-fns';
import BaseTemplate from './BaseTemplate';
import { formatCurrency } from '../../utils/formatCurrency';

const Template9 = ({ data }) => {
  const { billTo = {}, shipTo = {}, invoice = {}, yourCompany = {}, items = [], taxPercentage = 0, taxAmount = 0, subTotal = 0, grandTotal = 0, notes = '', selectedCurrency, img } = data || {};

  return (
    <BaseTemplate data={data}>
      <div className="bg-white p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-orange-600 mb-2">Invoice</h1>
            <h2 className="text-xl font-bold">
              {yourCompany.name || "Company Name"}
            </h2>
            <p className="text-sm text-gray-500">{yourCompany.address}</p>
            <p className="text-sm text-gray-500">{yourCompany.phone}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              <strong>Invoice #:</strong> {invoice.number || ""}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Date:</strong> {invoice.date || ""}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Due Date:</strong> {invoice.paymentDate || ""}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8 border-t border-b border-orange-100 py-6">
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-2 text-orange-600">
              Bill To
            </h3>
            <p className="font-bold">{billTo.name || "Client Name"}</p>
            <p className="text-sm text-gray-600">
              {billTo.address || "Client Address"}
            </p>
            <p className="text-sm text-gray-600">
              {billTo.phone || "Client Phone"}
            </p>
          </div>
          {shipTo && shipTo.name && (
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-2 text-orange-600">
                Ship To
              </h3>
              <p className="font-bold">{shipTo.name}</p>
              <p className="text-sm text-gray-600">{shipTo.address}</p>
              <p className="text-sm text-gray-600">{shipTo.phone}</p>
            </div>
          )}
        </div>

        <table className="w-full mb-8 border-collapse">
          <thead>
            <tr className="bg-orange-600 text-white">
              <th className="p-2 text-left border border-gray-300">Description</th>
              <th className="p-2 text-right border border-gray-300 w-24">Qty</th>
              <th className="p-2 text-right border border-gray-300 w-32">Unit Price</th>
              <th className="p-2 text-right border border-gray-300 w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="p-2 border border-gray-300">
                  <strong>{item.name || "Item Name"}</strong>
                  <br />
                  <span className="text-sm text-gray-600">
                    {item.description || "Item Description"}
                  </span>
                </td>
                <td className="p-2 text-right border border-gray-300">
                  {item.quantity || 0}
                </td>
                <td className="p-2 text-right border border-gray-300">
                  {formatCurrency(item.amount || 0, selectedCurrency)}
                </td>
                <td className="p-2 text-right border border-gray-300">
                  {formatCurrency((item.amount || 0) * (item.quantity || 0), selectedCurrency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-8">
          <div className="w-1/2 bg-orange-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span>Sub Total:</span>
              <span>{formatCurrency(subTotal, selectedCurrency)}</span>
            </div>
            {taxPercentage > 0 && (
              <div className="flex justify-between mb-2">
                <span>Tax ({taxPercentage}%):</span>
                <span>{formatCurrency(taxAmount, selectedCurrency)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg mt-2 text-orange-600 border-t border-orange-200 pt-2">
              <span>Total:</span>
              <span className="text-orange-600">
                {formatCurrency(grandTotal, selectedCurrency)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-end border-t border-orange-100 pt-4">
          {notes && (
            <div className="max-w-lg">
              <h3 className="text-lg font-semibold text-orange-600 mb-2">Remarks</h3>
              <p className="text-sm text-gray-600">{notes}</p>
            </div>
          )}
          {img && (
            <div className="text-right">
              <h3 className="font-semibold text-sm mb-2 text-orange-600">Signature:</h3>
              <img src={img} alt="Signature" className="max-h-16 object-contain ml-auto" />
            </div>
          )}
        </div>
      </div>
    </BaseTemplate>
  );
};

export default Template9;
