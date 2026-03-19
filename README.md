# 🛒 Customer Insights Dashboard

Hey there! 👋 Welcome to the **Customer Insights Dashboard** – your go-to tool for managing customer data and uncovering spending patterns with style! 

Built with ❤️ using Flask (Python) + SQLite + modern frontend tech, this app helps businesses track customers, analyze purchase behaviors, and segment spenders (High, Medium, Low). Perfect for data-driven decisions!

![Screenshot](https://via.placeholder.com/1200x600/0d6efd/ffffff?text=Customer+Insights+Dashboard) <!-- Replace with actual screenshot if you want -->

## ✨ Features
- **Add Customers** – Quick form with validation (name, age 18+, city, purchase amount)
- **Live Customer Table** – Sortable list with total count
- **Smart Insights** – Average purchase + beautiful pie chart for spender segments:
  - 🟢 High (> ₹500)
  - 🟡 Medium (₹200-500) 
  - 🔴 Low (< ₹200)
- **Professional UI** – Bootstrap 5, Chart.js, responsive design, loading states, success/error toasts
- **Robust Backend** – Full CRUD, input validation, error handling, logging
- **Zero Setup** – SQLite database auto-initializes

## 🚀 Quick Start (2 minutes!)

1. **Install dependencies** (Python 3.8+ required):
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the app**:
   ```bash
   cd backend  # Optional, since app runs from project root
   python app.py
   ```
   Or simply: `python backend/app.py`

3. **Open in browser**: http://127.0.0.1:5000 🎉

4. **First time?** Click **Initialize DB** button.

## 📱 Demo Flow
1. Fill form → **Add Customer** → See it in table instantly!
2. **Refresh Insights** → Watch the pie chart update with segments
3. Add more data → See averages/segments change live

## 🛠 Tech Stack
```
Backend: Flask + SQLite3 + Context Managers
Frontend: Bootstrap 5 + Chart.js + Vanilla JS (no frameworks!)
Extras: CORS, Logging, Professional validation & UX
```

## 🤝 Contributing
Love it? Found a bug? PRs welcome! Just:
1. Fork & clone
2. `pip install -r requirements.txt`
3. Make changes
4. Test thoroughly
5. Submit PR

## 📄 License
MIT – Use it anywhere!

## 🙌 Shoutout
Built to impress for company interviews. Questions? Hit me up!

**Happy analyzing! 📈✨**

