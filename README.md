<div align="center">

# 📊 Invoicely

### Professional Invoice & Receipt Management System

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

**A comprehensive, offline-first billing and financial management suite tailored for freelancers, entrepreneurs, and small businesses.**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Contributing](#-contributing) • [License](#-license)

</div>

---

## ✨ Features

### 📋 Core Billing & Document Management

- **📄 Invoice Wizard** - Step-by-step guided interface for creating professional invoices
- **🧾 Receipt Generator** - Streamlined receipt creation with powerful features
- **🎨 15+ Professional Templates** - Modern, industry-ready designs (10 invoice + 4 receipt templates)
- **👁️ Live Preview** - Real-time template preview before exporting
- **💱 Multi-Currency Support** - Full support for INR, USD, EUR, GBP, and more
- **✍️ Digital Signature** - Sign documents digitally with signature canvas
- **📥 PDF Export** - High-quality PDF generation with one click (html2canvas + jsPDF)

### 🗂️ Data Management

- **👥 Client Directory** - Centralized customer database with search and pagination
- **📦 Product Inventory** - Manage services and products with default pricing
- **📚 Billing History** - Automatic saving of all invoices and receipts
- **🔍 Advanced Search** - Full-text search across all saved documents
- **💾 Smart Auto-Save** - Real-time saving as you type - never lose your work
- **📄 Pagination** - Efficient browsing through large datasets

### 📊 Business Intelligence & Analytics

- **📈 Performance Ledger** - Excel-style transaction sheet with comprehensive filtering
- **💹 Revenue Analytics** - Weekly, monthly, and yearly performance tracking
- **📉 Transaction Overview** - Detailed breakdown of invoices vs receipts
- **🤖 Business Insights** - AI-powered recommendations based on your data
- **📊 Visual Charts** - Interactive data visualization with Recharts

### 🧮 Business Toolkit (6 Calculators)

- **💰 Tax/GST Calculator** - Calculate taxes with inclusive/exclusive modes
- **📊 Profit Margin Calculator** - Analyze cost vs selling price
- **🏷️ Discount Calculator** - Calculate final prices and savings
- **⚖️ Unit Price Calculator** - Determine per-unit rates
- **⏰ Late Fee Calculator** - Calculate interest on overdue payments
- **📈 ROI Calculator** - Track return on investment

### 🔗 Smart Features

- **🔄 Contextual Navigation** - Jump between tools with pre-filled data
- **⚡ Quick Actions** - Estimate late fees from totals, calculate tax from item prices
- **🎯 One-Click Data Fill** - Populate forms instantly from saved clients/inventory
- **🎲 Demo Data Generator** - Fill all sections with sample data for testing

### 💾 Privacy & Offline Capabilities

- **📱 PWA Ready** - Install as a desktop or mobile app
- **🔌 Offline-First** - Works without internet connection
- **🔒 Privacy First** - All data stored locally in your browser (localStorage)
- **🚫 No Tracking** - Zero external analytics or data collection
- **🏠 No Backend Required** - Completely client-side application
- **🌐 Cross-Platform** - Works on Windows, Mac, Linux, iOS, and Android

### 🎨 User Experience

- **🌓 Dark/Light Mode** - Beautiful theme switching with next-themes
- **📱 Responsive Design** - Mobile-first approach, optimized for all devices
- **🎯 Touch-Friendly** - Optimized for tablets and touch interfaces
- **♿ Accessible** - Built with Radix UI primitives for accessibility
- **🎭 Modern UI** - Shadcn UI components with Tailwind CSS
- **🔔 Toast Notifications** - Real-time feedback with Sonner

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 15+ (App Router) |
| **Language** | JavaScript (React 18+) |
| **Styling** | Tailwind CSS with custom design tokens |
| **UI Components** | Shadcn UI (Radix UI primitives) |
| **Icons** | Lucide React |
| **State Management** | React Hooks + LocalStorage |
| **Notifications** | Sonner (Toast notifications) |
| **PDF Generation** | html2canvas + jsPDF |
| **Signature** | react-signature-canvas |
| **Charts** | Recharts |
| **PWA** | @ducanh2912/next-pwa |
| **Forms** | React Hook Form + Zod validation |
| **Date Handling** | date-fns |

---

## 📦 Installation

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** or **pnpm**

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/matiullahpro/invoicely.git
   cd invoicely
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**

   ```bash
   npm run build
   npm start
   ```

---

## 🚀 Usage

### Getting Started

1. **Explore with Demo Data**
   - Click the **"Fill All Demo Data"** button in the navbar
   - This populates sample clients, inventory, and transactions
   - Perfect for testing and understanding features

2. **Navigate the Interface**
   - Use the top navigation bar to access different sections
   - Toggle between light/dark mode with the theme switcher

### Creating Your First Invoice

1. Navigate to **Invoices** (home page)
2. Fill in your business details (auto-saved)
3. Add customer information (or select from saved clients)
4. Add line items (products/services)
5. Navigate to the **Template** step
6. Choose from 10+ professional templates
7. Preview and download as PDF

### Creating Receipts

1. Navigate to **Receipts** from the navbar
2. Follow the same wizard-style process
3. Choose from 4 receipt-specific templates
4. Download or save to history

### Managing Your Data

- **👥 Clients** - Add, edit, search, and delete customer information
- **📦 Inventory** - Manage your product/service catalog with pricing
- **📚 History** - View all past invoices and receipts with filtering
- **📊 Ledger** - Analyze performance with the transaction sheet

### Using Business Tools

1. Navigate to **Tools** from the navbar
2. Select any calculator (Tax, Profit, Discount, etc.)
3. All calculations update in real-time
4. Use interlinking icons (%) in wizards to jump to tools with pre-filled data

---

## 📁 Project Structure

```
invoicely/
├── src/
│   ├── app/
│   │   ├── about/              # About page
│   │   ├── clients/            # Client management page
│   │   ├── history/            # Billing history page
│   │   ├── inventory/          # Product inventory page
│   │   ├── ledger/             # Performance ledger & analytics
│   │   ├── receipt/            # Receipt wizard
│   │   ├── template/           # Invoice template preview
│   │   ├── tools/              # Business calculators (6 tools)
│   │   ├── layout.jsx          # Root layout with navbar & theme
│   │   ├── page.jsx            # Invoice wizard (home)
│   │   ├── globals.css         # Global styles
│   │   └── manifest.json       # PWA manifest
│   ├── components/
│   │   ├── templates/          # Invoice & receipt templates
│   │   │   ├── Template1-9.jsx # 9 invoice templates
│   │   │   ├── Receipt1-4.jsx  # 4 receipt templates
│   │   │   └── BaseTemplate.jsx
│   │   ├── ui/                 # Shadcn UI components (48 components)
│   │   ├── BillToSection.jsx   # Reusable billing section
│   │   ├── ShipToSection.jsx   # Shipping details section
│   │   ├── FloatingLabelInput.jsx
│   │   ├── InvoiceTemplate.jsx
│   │   ├── ItemDetails.jsx     # Line items component
│   │   ├── Navbar.jsx          # Main navigation
│   │   ├── Pagination.jsx      # Pagination component
│   │   ├── ThemeProvider.jsx   # Dark/light mode provider
│   │   └── ReactQueryProvider.jsx
│   ├── lib/
│   │   └── utils.js            # Utility functions (cn, etc.)
│   └── utils/
│       ├── formatCurrency.js   # Currency formatting
│       ├── getCurrencySymbol.js
│       ├── pdfGenerator.js     # PDF export logic
│       └── templateRegistry.js # Template configuration
├── public/
│   ├── templates/              # Template preview images
│   └── icons/                  # PWA icons
├── .eslintrc.json
├── .gitignore
├── components.json             # Shadcn UI config
├── jsconfig.json
├── next.config.mjs             # Next.js + PWA config
├── package.json
├── postcss.config.js
├── tailwind.config.js          # Tailwind configuration
└── README.md
```

---

## 🎨 Templates

### Invoice Templates (10)

- **Template 1-9** - Professional designs with varying layouts
- **Modern aesthetics** - Clean, business-ready styling
- **Customizable** - Brand colors and fonts
- **Print-optimized** - Perfect PDF output

### Receipt Templates (4)

- **Receipt 1-4** - Compact, receipt-specific designs
- **Thermal printer friendly** - Optimized layouts
- **Quick generation** - Streamlined for speed

---

## 🔒 Privacy & Security

- **🏠 100% Client-Side** - No server, no database, no tracking
- **🔐 Your Data, Your Control** - Everything stored locally in browser
- **🚫 No External Calls** - Except for font loading (Google Fonts)
- **🔌 Safe to Use Offline** - Perfect for sensitive financial data
- **🛡️ No User Accounts** - No registration, no login required
- **🔒 Browser Security** - Protected by browser's same-origin policy

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 **Report bugs** - Open an issue with detailed reproduction steps
- 💡 **Suggest features** - Share your ideas for improvements
- 📝 **Improve documentation** - Help make the docs clearer
- 🎨 **Add templates** - Create new invoice/receipt designs
- 🔧 **Fix issues** - Submit pull requests for open issues
- 🌍 **Translations** - Help localize the app (future feature)

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Test thoroughly
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**
   - Describe your changes clearly
   - Reference any related issues

### Code Style

- Use **ES6+ JavaScript**
- Follow **React best practices**
- Use **Tailwind CSS** for styling
- Keep components **small and focused**
- Add **PropTypes** or **JSDoc** comments

### Adding New Templates

1. Create a new component in `src/components/templates/`
2. Follow the existing template structure
3. Register in `src/utils/templateRegistry.js`
4. Add preview image to `public/templates/`
5. Test PDF export thoroughly

---

## 🗺️ Roadmap

### Planned Features

- [ ] **Export/Import Data** - JSON backup and restore
- [ ] **Custom Template Builder** - Visual template editor
- [ ] **Email Integration** - Send invoices directly via email
- [ ] **Payment Tracking** - Mark invoices as paid/unpaid
- [ ] **Recurring Invoices** - Automated recurring billing
- [ ] **Advanced Reporting** - More charts and analytics
- [ ] **Multiple Business Profiles** - Manage multiple businesses
- [ ] **Cloud Sync (Optional)** - Optional cloud backup
- [ ] **Multi-language Support** - Internationalization (i18n)
- [ ] **Tax Presets** - Pre-configured tax rates by country
- [ ] **Expense Tracking** - Track business expenses
- [ ] **Client Portal** - Share invoices with clients

### Recently Completed ✅

- ✅ PWA support with offline capabilities
- ✅ Dark/light mode theming
- ✅ 15+ professional templates
- ✅ Business calculator toolkit
- ✅ Performance ledger & analytics
- ✅ Digital signature support
- ✅ Multi-currency support

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What this means:

- ✅ **Commercial use** - Use it in your business
- ✅ **Modification** - Customize as you need
- ✅ **Distribution** - Share with others
- ✅ **Private use** - Use it privately
- ⚠️ **Liability** - No warranty provided
- ⚠️ **Attribution** - Credit the original authors

---

## 🙏 Acknowledgments

This project wouldn't be possible without these amazing open-source projects:

- [**Next.js**](https://nextjs.org/) - The React framework for production
- [**Shadcn UI**](https://ui.shadcn.com/) - Beautiful, accessible UI components
- [**Radix UI**](https://www.radix-ui.com/) - Unstyled, accessible components
- [**Tailwind CSS**](https://tailwindcss.com/) - Utility-first CSS framework
- [**Lucide**](https://lucide.dev/) - Beautiful & consistent icon pack
- [**Recharts**](https://recharts.org/) - Composable charting library
- [**jsPDF**](https://github.com/parallax/jsPDF) - PDF generation library
- [**html2canvas**](https://html2canvas.hertzen.com/) - Screenshot library

Special thanks to all contributors and the open-source community! 💙

---

## 📞 Support & Community

- 🐛 **Bug Reports**: [Open an issue](https://github.com/matiullahpro/invoicely/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/matiullahpro/invoicely/discussions)
- 📧 **Email**: your.email@example.com
- 🌟 **Star this repo** if you find it useful!

---

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/matiullahpro/invoicely?style=social)
![GitHub forks](https://img.shields.io/github/forks/matiullahpro/invoicely?style=social)
![GitHub issues](https://img.shields.io/github/issues/matiullahpro/invoicely)
![GitHub pull requests](https://img.shields.io/github/issues-pr/matiullahpro/invoicely)

---

<div align="center">

**Created with ❤️ for freelancers, entrepreneurs, and small businesses.**

*Simplify your billing. Focus on what matters.*

### [⭐ Star this repo](https://github.com/matiullahpro/invoicely) • [🍴 Fork it](https://github.com/matiullahpro/invoicely/fork) • [📖 Read the docs](#)

</div>

This project is tested with BrowserStack.
