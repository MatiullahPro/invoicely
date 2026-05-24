import React from 'react';
import { format } from 'date-fns';
import BaseTemplate from './BaseTemplate';
import { formatCurrency } from '../../utils/formatCurrency';

const Template6 = ({ data }) => {
  const { billTo = {}, shipTo = {}, invoice = {}, yourCompany = {}, items = [], taxPercentage = 0, taxAmount = 0, subTotal = 0, grandTotal = 0, notes = '', selectedCurrency, img } = data || {};

  return (
    <BaseTemplate data={data}>
      <div className="bg-white p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "#14A8DE" }}>
              {yourCompany.name || "Company Name"}
            </h2>
            <p className="text-sm text-gray-600">
              {yourCompany.address || "Company Address"}
            </p>
            <p className="text-sm text-gray-600">
              {yourCompany.phone || "Company Phone"}
            </p>
          </div>
          <div className="text-right">
            <h1 className="text-4xl font-extrabold" style={{ color: "#14A8DE" }}>
              INVOICE
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              <strong>Invoice #:</strong> {invoice.number || ""}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Date:</strong> {invoice.date ? format(new Date(invoice.date), "MMM dd, yyyy") : ""}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Due Date:</strong> {invoice.paymentDate ? format(new Date(invoice.paymentDate), "MMM dd, yyyy") : ""}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8 border-t border-b py-6">
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-2" style={{ color: "#14A8DE" }}>
              Bill To
            </h3>
            <p className="font-bold">{billTo.name || "Client Name"}</p>
            <p className="text-sm text-gray-600">{billTo.address || "Client Address"}</p>
            <p className="text-sm text-gray-600">{billTo.phone || "Client Phone"}</p>
          </div>
          {shipTo && shipTo.name && (
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-2" style={{ color: "#14A8DE" }}>
                Ship To
              </h3>
              <p className="font-bold">{shipTo.name}</p>
              <p className="text-sm text-gray-600">{shipTo.address}</p>
              <p className="text-sm text-gray-600">{shipTo.phone}</p>
            </div>
          )}
        </div>

        <table className="w-full mb-8 border border-gray-300 border-collapse">
          <thead>
            <tr className="text-white" style={{ backgroundColor: "#14A8DE" }}>
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

        <div className="flex justify-end">
          <table className="w-1/2 mb-8 border border-gray-300">
            <tbody>
              <tr>
                <td className="p-2 text-right font-semibold border border-gray-300">
                  Sub Total
                </td>
                <td className="p-2 text-right border border-gray-300">
                  {formatCurrency(subTotal, selectedCurrency)}
                </td>
              </tr>
              {taxPercentage > 0 && (
                <tr>
                  <td className="p-2 text-right font-semibold border border-gray-300">
                    Tax ({taxPercentage}%)
                  </td>
                  <td className="p-2 text-right border border-gray-300">
                    {formatCurrency(taxAmount, selectedCurrency)}
                  </td>
                </tr>
              )}
              <tr className="text-white" style={{ backgroundColor: "#14A8DE" }}>
                <td className="p-2 text-right font-semibold border border-gray-300">
                  Total Due Amount
                </td>
                <td className="p-2 text-right border border-gray-300">
                  {formatCurrency(grandTotal, selectedCurrency)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-between items-end border-t pt-4">
          {notes && (
            <div className="max-w-lg">
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-2" style={{ color: "#14A8DE" }}>Notes</h3>
              <p className="text-sm text-gray-600">{notes}</p>
            </div>
          )}
          {img && (
            <div className="text-right">
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-2" style={{ color: "#14A8DE" }}>Signature:</h3>
              <img src={img} alt="Signature" className="max-h-16 object-contain ml-auto" />
            </div>
          )}
        </div>
      </div>
    </BaseTemplate>
  );
};

export default Template6;
