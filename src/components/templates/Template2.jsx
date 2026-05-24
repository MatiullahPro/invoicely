import React from 'react';
import BaseTemplate from './BaseTemplate';
import { formatCurrency } from '../../utils/formatCurrency';

const Template2 = ({ data }) => {
  const { billTo, shipTo, invoice, yourCompany, items, taxPercentage, taxAmount, subTotal, grandTotal, notes, selectedCurrency, img } = data;

  return (
    <BaseTemplate data={data}>
      <div className="bg-white p-8 max-w-4xl mx-auto">
        <div className="flex justify-between mb-4 border-b-2 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-cyan-700">
              {yourCompany.name}
            </h1>
            <p className="text-sm text-gray-500">{yourCompany.address}</p>
            <p className="text-sm text-gray-500">{yourCompany.phone}</p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-black text-cyan-700">INVOICE</h2>
            <p className="text-sm text-gray-500">#{invoice.number}</p>
          </div>
        </div>

        <div className="flex justify-between mb-8">
          <div>
            <h3 className="font-semibold text-cyan-700">Bill To:</h3>
            <p className="font-medium">{billTo.name}</p>
            <p className="text-sm text-gray-500">{billTo.address}</p>
            <p className="text-sm text-gray-500">{billTo.phone}</p>
          </div>
          <div>
            <h3 className="font-semibold text-cyan-700">Ship To:</h3>
            <p className="font-medium">{shipTo.name}</p>
            <p className="text-sm text-gray-500">{shipTo.address}</p>
            <p className="text-sm text-gray-500">{shipTo.phone}</p>
          </div>
          <div className="text-right text-sm">
            <p>
              <span className="font-semibold text-cyan-700">Date:</span>{" "}
              {invoice.date}
            </p>
            <p>
              <span className="font-semibold text-cyan-700">Due Date:</span>{" "}
              {invoice.paymentDate}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cyan-700 text-white">
                <th className="p-2 text-left font-bold uppercase text-xs">
                  Description
                </th>
                <th className="p-2 text-right font-bold uppercase text-xs">
                  Qty
                </th>
                <th className="p-2 text-right font-bold uppercase text-xs">
                  Unit Price
                </th>
                <th className="p-2 text-right font-bold uppercase text-xs">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </td>
                  <td className="p-2 text-right">{item.quantity || 0}</td>
                  <td className="p-2 text-right">
                    {formatCurrency(item.amount || 0, selectedCurrency)}
                  </td>
                  <td className="p-2 text-right font-semibold">
                    {formatCurrency(
                      (item.quantity || 0) * (item.amount || 0),
                      selectedCurrency
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-1/3">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>{formatCurrency(subTotal, selectedCurrency)}</span>
            </div>
            {taxPercentage > 0 && (
              <div className="flex justify-between mb-2">
                <span>Tax ({taxPercentage}%):</span>
                <span>{formatCurrency(taxAmount, selectedCurrency)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>{formatCurrency(grandTotal, selectedCurrency)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-end border-t pt-4">
          {notes && (
            <div className="text-sm max-w-lg">
              <h3 className="font-semibold mb-2 text-cyan-700">Notes:</h3>
              <p className="text-gray-600">{notes}</p>
            </div>
          )}
          {img && (
            <div className="text-right">
              <h3 className="font-semibold mb-2 text-cyan-700">Signature:</h3>
              <img src={img} alt="Signature" className="max-h-16 object-contain ml-auto" />
            </div>
          )}
        </div>
      </div>
    </BaseTemplate>
  );
};

export default Template2;
