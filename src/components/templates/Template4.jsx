import React from 'react';
import { format } from 'date-fns';
import BaseTemplate from './BaseTemplate';
import { formatCurrency } from '../../utils/formatCurrency';

const Template4 = ({ data }) => {
  const { billTo = {}, shipTo = {}, invoice = {}, yourCompany = {}, items = [], taxPercentage = 0, taxAmount = 0, subTotal = 0, grandTotal = 0, notes = '', selectedCurrency, img } = data || {};

  return (
    <BaseTemplate data={data}>
      <div className="bg-white p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-purple-600 mb-4">Invoice</h1>
            <p>
              <strong>Invoice No:</strong> {invoice.number || ""}
            </p>
            <p>
              <strong>Date:</strong> {invoice.date || ""}
            </p>
            <p>
              <strong>Due Date:</strong> {invoice.paymentDate || ""}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-800">
              {yourCompany.name || "Your Company Name"}
            </h2>
            <p className="text-sm text-gray-600">
              {yourCompany.address || "Your Address"}
            </p>
            <p className="text-sm text-gray-600">
              {yourCompany.phone || "Your Phone"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="border border-purple-100 p-4 rounded-lg bg-purple-50/30">
            <h3 className="text-lg font-semibold text-purple-600 mb-2">
              Bill To
            </h3>
            <p>
              <strong>{billTo.name || "Client Name"}</strong>
            </p>
            <p className="text-sm text-gray-600">
              {billTo.address || "Client Address"}
            </p>
            <p className="text-sm text-gray-600">
              {billTo.phone || "Client Phone"}
            </p>
          </div>
          {shipTo && shipTo.name && (
            <div className="border border-purple-100 p-4 rounded-lg bg-purple-50/30">
              <h3 className="text-lg font-semibold text-purple-600 mb-2">
                Ship To
              </h3>
              <p>
                <strong>{shipTo.name}</strong>
              </p>
              <p className="text-sm text-gray-600">{shipTo.address}</p>
              <p className="text-sm text-gray-600">{shipTo.phone}</p>
            </div>
          )}
        </div>

        <table className="w-full mb-8 border-collapse">
          <thead>
            <tr className="bg-purple-600 text-white">
              <th className="p-2 text-left border border-gray-300">Item</th>
              <th className="p-2 text-right border border-gray-300 w-24">
                Qty
              </th>
              <th className="p-2 text-right border border-gray-300 w-32">
                Unit Price
              </th>
              <th className="p-2 text-right border border-gray-300 w-32">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-purple-50/10">
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
                  {formatCurrency((item.quantity || 0) * (item.amount || 0), selectedCurrency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-8">
          <div className="w-1/3">
            <p className="flex justify-between">
              <span>Sub Total:</span> <span>{formatCurrency(subTotal, selectedCurrency)}</span>
            </p>
            {taxPercentage > 0 && (
              <>
                <p className="flex justify-between">
                  <span>Tax({taxPercentage}%):</span> <span>{formatCurrency(taxAmount, selectedCurrency)}</span>
                </p>
              </>
            )}
            <hr className="my-2" />
            <p className="flex justify-between font-bold text-lg mt-2">
              <span>Total:</span> <span>{formatCurrency(grandTotal, selectedCurrency)}</span>
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-end border-t border-purple-100 pt-4">
          {notes && (
            <div className="max-w-lg">
              <h3 className="text-lg font-semibold text-purple-600 mb-2">Note</h3>
              <p className="text-sm text-gray-600">{notes}</p>
            </div>
          )}
          {img && (
            <div className="text-right">
              <h3 className="font-semibold text-sm mb-2 text-purple-600">Signature:</h3>
              <img src={img} alt="Signature" className="max-h-16 object-contain ml-auto" />
            </div>
          )}
        </div>
      </div>
    </BaseTemplate>
  );
};

export default Template4;
