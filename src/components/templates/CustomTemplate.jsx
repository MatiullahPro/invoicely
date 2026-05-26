import React from 'react';
import BaseTemplate from './BaseTemplate';
import { formatCurrency } from '../../utils/formatCurrency';

// Fallback default config
const DEFAULT_CONFIG = {
  name: "Default Custom",
  themeColor: "#4f46e5", // Indigo
  secondaryColor: "#1e1b4b",
  textColor: "#1f2937",
  fontFamily: "Inter",
  layout: "modern", // modern, minimal, banner, sidebar
  tableStyle: "striped", // striped, bordered, minimal
  visibility: {
    shipTo: true,
    signature: true,
    dueDate: true,
    tax: true,
    notes: true
  },
  labels: {
    invoice: "INVOICE",
    invoiceNumber: "Invoice Number",
    invoiceDate: "Invoice Date",
    dueDate: "Due Date",
    billTo: "Bill To",
    shipTo: "Ship To",
    itemName: "Item",
    quantity: "Quantity",
    unitPrice: "Unit Price",
    total: "Total",
    subtotal: "Subtotal",
    tax: "Tax",
    grandTotal: "Total Amount"
  }
};

export default function CustomTemplate({ data, config = DEFAULT_CONFIG }) {
  const activeConfig = { ...DEFAULT_CONFIG, ...config };
  activeConfig.visibility = { ...DEFAULT_CONFIG.visibility, ...config.visibility };
  activeConfig.labels = { ...DEFAULT_CONFIG.labels, ...config.labels };

  const { 
    billTo = { name: "", address: "", phone: "" }, 
    shipTo = { name: "", address: "", phone: "" }, 
    invoice = { date: "", paymentDate: "", number: "" }, 
    yourCompany = { name: "", address: "", phone: "" }, 
    items = [], 
    taxPercentage = 0, 
    taxAmount = 0, 
    subTotal = 0, 
    grandTotal = 0, 
    notes = "", 
    selectedCurrency = "USD", 
    img = null 
  } = data;

  const { themeColor, secondaryColor, textColor, fontFamily, layout, tableStyle, visibility, labels } = activeConfig;

  // Custom Font styling map
  const getFontClass = () => {
    switch (fontFamily) {
      case 'Playfair Display': return 'font-serif';
      case 'Fira Code': return 'font-mono';
      default: return 'font-sans';
    }
  };

  const mainStyle = {
    color: textColor,
    fontFamily: fontFamily === 'Inter' ? '"Inter", sans-serif' : fontFamily === 'Outfit' ? '"Outfit", sans-serif' : fontFamily === 'Playfair Display' ? '"Playfair Display", serif' : fontFamily === 'Fira Code' ? '"Fira Code", monospace' : 'sans-serif',
  };

  return (
    <BaseTemplate data={data}>
      <div 
        className={`bg-white p-8 max-w-4xl mx-auto h-full flex flex-col justify-between ${getFontClass()}`} 
        style={mainStyle}
      >
        <div className="flex-1">
          {/* LAYOUT 1: MODERN SPLIT */}
          {layout === 'modern' && (
            <div>
              <div className="flex justify-between items-start mb-8 pb-6 border-b-2" style={{ borderColor: themeColor + '20' }}>
                <div>
                  <h1 className="text-3xl font-black tracking-tight" style={{ color: themeColor }}>{yourCompany.name || "COMPANY NAME"}</h1>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs">{yourCompany.address}</p>
                  <p className="text-xs text-gray-500">{yourCompany.phone}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-4xl font-black uppercase tracking-tighter" style={{ color: secondaryColor }}>{labels.invoice}</h2>
                  <div className="mt-3 text-xs space-y-1">
                    <p><span className="font-bold text-gray-400">{labels.invoiceNumber}:</span> {invoice.number}</p>
                    <p><span className="font-bold text-gray-400">{labels.invoiceDate}:</span> {invoice.date}</p>
                    {visibility.dueDate && <p><span className="font-bold text-gray-400">{labels.dueDate}:</span> {invoice.paymentDate}</p>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{labels.billTo}</h3>
                  <p className="font-bold text-sm" style={{ color: themeColor }}>{billTo.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{billTo.address}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{billTo.phone}</p>
                </div>
                {visibility.shipTo && shipTo.name ? (
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{labels.shipTo}</h3>
                    <p className="font-bold text-sm" style={{ color: themeColor }}>{shipTo.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{shipTo.address}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{shipTo.phone}</p>
                  </div>
                ) : <div />}
              </div>
            </div>
          )}

          {/* LAYOUT 2: CLEAN MINIMALIST */}
          {layout === 'minimal' && (
            <div>
              <div className="flex justify-between items-baseline mb-12">
                <div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{yourCompany.name || "COMPANY NAME"}</h1>
                  <p className="text-xs text-gray-400 mt-1">{yourCompany.address} • {yourCompany.phone}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-light tracking-widest uppercase text-gray-400">{labels.invoice}</h2>
                  <p className="text-xs text-gray-900 font-bold mt-1">#{invoice.number}</p>
                </div>
              </div>

              <div className="flex justify-between mb-8 text-xs border-b pb-6">
                <div>
                  <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1">{labels.billTo}</span>
                  <p className="font-bold text-gray-900 text-sm">{billTo.name}</p>
                  <p className="max-w-xs text-gray-500 mt-0.5">{billTo.address}</p>
                </div>
                <div className="text-right space-y-1">
                  <p><span className="text-gray-400 uppercase tracking-wider font-semibold">{labels.invoiceDate}:</span> {invoice.date}</p>
                  {visibility.dueDate && <p><span className="text-gray-400 uppercase tracking-wider font-semibold">{labels.dueDate}:</span> {invoice.paymentDate}</p>}
                </div>
              </div>
            </div>
          )}

          {/* LAYOUT 3: BOLD TOP BANNER */}
          {layout === 'banner' && (
            <div>
              <div className="-mx-8 -mt-8 p-8 mb-8 flex justify-between items-center text-white" style={{ backgroundColor: themeColor }}>
                <div>
                  <h1 className="text-3xl font-black tracking-tight">{yourCompany.name || "COMPANY NAME"}</h1>
                  <p className="text-xs opacity-80 mt-1 max-w-xs">{yourCompany.address}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-4xl font-black uppercase tracking-tight">{labels.invoice}</h2>
                  <p className="text-xs opacity-90 mt-1">#{invoice.number}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8 text-xs">
                <div>
                  <h3 className="font-bold uppercase tracking-wider text-gray-400 mb-1">{labels.billTo}</h3>
                  <p className="font-bold" style={{ color: secondaryColor }}>{billTo.name}</p>
                  <p className="text-gray-500 mt-0.5">{billTo.address}</p>
                </div>
                {visibility.shipTo && shipTo.name ? (
                  <div>
                    <h3 className="font-bold uppercase tracking-wider text-gray-400 mb-1">{labels.shipTo}</h3>
                    <p className="font-bold" style={{ color: secondaryColor }}>{shipTo.name}</p>
                    <p className="text-gray-500 mt-0.5">{shipTo.address}</p>
                  </div>
                ) : <div />}
                <div className="text-right">
                  <h3 className="font-bold uppercase tracking-wider text-gray-400 mb-1">Details</h3>
                  <p><span className="font-semibold text-gray-400">{labels.invoiceDate}:</span> {invoice.date}</p>
                  {visibility.dueDate && <p><span className="font-semibold text-gray-400">{labels.dueDate}:</span> {invoice.paymentDate}</p>}
                </div>
              </div>
            </div>
          )}

          {/* LAYOUT 4: LEFT SIDEBAR ACCENT */}
          {layout === 'sidebar' && (
            <div className="grid grid-cols-4 gap-6 -mx-8 -my-8 min-h-[1050px] items-stretch flex-1">
              <div className="col-span-1 p-6 text-white flex flex-col justify-between" style={{ backgroundColor: themeColor }}>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 leading-none">{labels.invoice}</h2>
                  <div className="space-y-4 text-[10px] opacity-90">
                    <div>
                      <span className="font-bold uppercase text-gray-300 block">{labels.invoiceNumber}</span>
                      <span className="font-black text-sm">{invoice.number}</span>
                    </div>
                    <div>
                      <span className="font-bold uppercase text-gray-300 block">{labels.invoiceDate}</span>
                      <span className="font-bold">{invoice.date}</span>
                    </div>
                    {visibility.dueDate && (
                      <div>
                        <span className="font-bold uppercase text-gray-300 block">{labels.dueDate}</span>
                        <span className="font-bold">{invoice.paymentDate}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-[10px] space-y-2 opacity-80 mt-auto">
                  <p className="font-bold text-sm uppercase border-b pb-1 mb-1">{yourCompany.name}</p>
                  <p>{yourCompany.address}</p>
                  <p>{yourCompany.phone}</p>
                </div>
              </div>
              
              <div className="col-span-3 p-6 flex flex-col justify-between">
                <div>
                  <div className="grid grid-cols-2 gap-6 mb-8 border-b pb-6">
                    <div className="text-xs">
                      <span className="font-bold uppercase tracking-widest text-gray-400 block mb-1">{labels.billTo}</span>
                      <p className="font-bold text-sm" style={{ color: themeColor }}>{billTo.name}</p>
                      <p className="text-gray-500 mt-1">{billTo.address}</p>
                    </div>
                    {visibility.shipTo && shipTo.name && (
                      <div className="text-xs">
                        <span className="font-bold uppercase tracking-widest text-gray-400 block mb-1">{labels.shipTo}</span>
                        <p className="font-bold text-sm" style={{ color: themeColor }}>{shipTo.name}</p>
                        <p className="text-gray-500 mt-1">{shipTo.address}</p>
                      </div>
                    )}
                  </div>
                  {/* Table will render below inside main render */}
                </div>
              </div>
            </div>
          )}

          {/* TABLE COMPONENT (Rendered in sidebar layout inside sidebar column container, or standalone in other layouts) */}
          <div className={`${layout === 'sidebar' ? 'col-span-3 px-6' : 'w-full'}`}>
            <table className="w-full mb-8 text-xs">
              <thead>
                <tr 
                  className={`border-t border-b ${tableStyle === 'striped' ? 'bg-gray-50' : ''}`}
                  style={{ borderColor: tableStyle === 'bordered' ? themeColor : '#e5e7eb' }}
                >
                  <th className="p-3 text-left font-bold uppercase tracking-wider text-gray-500">{labels.itemName}</th>
                  <th className="p-3 text-center font-bold uppercase tracking-wider text-gray-500">{labels.quantity}</th>
                  <th className="p-3 text-right font-bold uppercase tracking-wider text-gray-500">{labels.unitPrice}</th>
                  <th className="p-3 text-right font-bold uppercase tracking-wider text-gray-500">{labels.total}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr 
                    key={index} 
                    className={`border-b ${tableStyle === 'striped' && index % 2 === 1 ? 'bg-gray-50/60' : ''}`}
                    style={{ 
                      borderColor: tableStyle === 'bordered' ? themeColor + '20' : '#f3f4f6',
                      borderLeft: tableStyle === 'bordered' ? `1px solid ${themeColor}20` : 'none',
                      borderRight: tableStyle === 'bordered' ? `1px solid ${themeColor}20` : 'none',
                    }}
                  >
                    <td className="p-3 font-medium">
                      <div className="font-bold text-gray-800 text-sm">{item.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{item.description}</div>
                    </td>
                    <td className="p-3 text-center font-semibold text-gray-600">{item.quantity}</td>
                    <td className="p-3 text-right font-semibold text-gray-600">
                      {formatCurrency(item.amount, selectedCurrency)}
                    </td>
                    <td className="p-3 text-right font-black text-gray-800 text-sm">
                      {formatCurrency(item.total, selectedCurrency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Subtotal, tax & grand totals */}
            <div className="flex justify-end mt-4">
              <div className="w-64 space-y-2 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>{labels.subtotal}:</span>
                  <span className="font-semibold">{formatCurrency(subTotal, selectedCurrency)}</span>
                </div>
                {visibility.tax && taxPercentage > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>{labels.tax} ({taxPercentage}%):</span>
                    <span className="font-semibold">{formatCurrency(taxAmount, selectedCurrency)}</span>
                  </div>
                )}
                <div 
                  className="flex justify-between items-center py-2 border-t font-black text-sm"
                  style={{ color: themeColor, borderColor: themeColor }}
                >
                  <span>{labels.grandTotal}:</span>
                  <span className="text-lg">{formatCurrency(grandTotal, selectedCurrency)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM METADATA & FOOTER */}
        <div className={`mt-8 ${layout === 'sidebar' ? 'col-span-4 px-6 border-t pt-4' : ''}`}>
          <div className="flex justify-between items-end border-t pt-6">
            {visibility.notes && notes && (
              <div className="max-w-md text-xs">
                <h4 className="font-black uppercase tracking-wider text-gray-400 mb-1">Notes & Terms</h4>
                <p className="text-gray-500 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100">{notes}</p>
              </div>
            )}
            {visibility.signature && img && (
              <div className="text-right">
                <h4 className="font-black uppercase tracking-wider text-gray-400 mb-2">Authorized Signature</h4>
                <div className="border border-dashed border-gray-200 p-2 rounded-xl bg-gray-50">
                  <img src={img} alt="Signature" className="max-h-12 object-contain ml-auto" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseTemplate>
  );
}
