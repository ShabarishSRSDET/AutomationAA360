# Automation Anywhere Playwright + API Testing Framework

This project is a **hybrid Playwright automation framework** designed for both **UI automation** and **API testing** for the Automation Anywhere platform.

It includes:
- **Page Object Model (POM)** for UI flows
- **Reusable API Client** for GET, POST, PATCH, PUT, DELETE
- **Environment-based config** for easy credentials & base URL setup
- **TypeScript** + **Playwright Test Runner**
- **Support for fixtures** to inject authenticated API clients into tests

---

## 📂 Project Structure

fwk/
├── api/
│ ├── services/
│ │ ├── apiClient.ts # Base API client (GET, POST, PUT, PATCH, DELETE)
│ │ ├── endpoints.ts # API endpoints in one place
│ ├── schemas.ts # API JSON schema definitions
│ ├── validators.ts # JSON schema validation utilities
│
├── common/
│ ├── reporter.ts # Custom reporting utility
│
pages/ # Page Object Model (POM) classes
├── CreateBotModal.ts
├── FormPage.ts
├── LoginPage.ts
├── SidebarPage.ts
├── TaskBotCanvasPage.ts
├── TaskBotPage.ts

tests/
├── api/
│ ├── learningInstances.spec.ts # API test for Learning Instances
├── fixtures/
│ ├── learningInstance.payload.json # Sample API payload
├── UI/
│ ├── TaskBotandform.spec.ts # UI test for Task Bot creation

.env # Environment variables
base.ui.ts # Base UI class for Playwright
package.json # Project dependencies
playwright.config.ts # Playwright configuration

---

## ⚙️ Setup Instructions

### 1️⃣ Prerequisites
- **Node.js** v18+
- **npm** or **yarn**


---

### 2️⃣ Clone the repository
```bash
git clone <your-repo-url>
cd automation-anywhere
```

---

### 3️⃣ Install dependencies
```bash
npm install
```
npm i -D zod @types/node dotenv  
---

### 4️⃣ Configure `.env` Please Update User Name and Password while Executing
Create a `.env` file in the root:

```env
# Application base URL
BASE_URL=https://community.cloud.automationanywhere.digital

# Default credentials for login
DEFAULT_USER=""
DEFAULT_PASS=""

# Run mode
HEADLESS=false
```

---

## 🚀 Running Tests

### Run all tests
```bash
npx playwright test
```

### Run ALL tests only
`
npx playwright test --grep @AA360
```
```

---

## 📊 Reports

After a run, view the HTML report:
```bash
npx playwright show-report
```

---

## 📌 Tags

- `@ui` → UI test cases  
- `@api` → API test cases  

---

## ✨ Features

- ✅ Hybrid **UI + API** testing
- ✅ Environment-based configuration
- ✅ Reusable API client with authentication
- ✅ Type-safe TypeScript setup
- ✅ HTML reporting
- ✅ Modular Page Objects

---

## 📄 License
This project is for **internal automation purposes** only.  
Not affiliated with Automation Anywhere Inc.
