# Customer Dashboard Professionalization - TODO

## Approved Plan Summary
**Goal**: Make full-stack customer dashboard production-ready for company assignment.
- Backend: Real CRUD, validation, error handling, static frontend serving.
- Frontend: Professional UI (responsive, table, charts via Chart.js, toasts, validation).
- Docs: Humanized README.md, requirements.txt, .gitignore.
- Runnable: `pip install -r requirements.txt && flask run` serves app at http://127.0.0.1:5000

**Information Gathered**:
- Backend: Flask/SQLite, basic endpoints, hardcoded add.
- Frontend: Basic form/JS/CSS, localhost fetches.
- Dependencies inferred: flask, flask-cors (add flask-sqlalchemy? keep simple).

**Detailed Update Plan**:
1. **Backend/app.py**: Add DB context manager, real POST /customers (add), PUT/DELETE, validation (WTForms/simple), serve static frontend at /, error handlers, if __name__.
2. **Frontend**: Modern UI - Bootstrap/Tailwind? (CDN for simple), DataTable for customers, Chart.js pie/bar for insights, form validation, loading spinners, success/error toasts.
3. **New files**: requirements.txt (flask, flask-cors), README.md (humanized), .gitignore, static/ move frontend there.
4. **Polish**: Logging, CORS proper, responsive.

**Dependent Files**:
- backend/app.py (main)
- frontend/* → move to backend/static/
- New: requirements.txt, README.md, .gitignore

**Followup Steps**:
1. Create/edit files per plan.
2. Test: Init DB, add/view customers, insights charts.
3. `pip install -r requirements.txt && python backend/app.py`
4. No active terminals, so safe.

**Steps Progress** (will update after each):
- [x] Step 1: Create requirements.txt & .gitignore
- [x] Step 2: Update backend/app.py (full rewrite professional)
- [x] Step 3: Move frontend to backend/static/, update paths
- [x] Step 4: Professionalize frontend files (HTML/JS/CSS with Chart.js, toasts)
- [x] Step 5: Create humanized README.md
- [x] Step 6: Test & complete

✅ Task complete! App is professional, fully functional, and ready for interviews.

