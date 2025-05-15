# 🌐 TextFlow: Collaborative Text Editor

TextFlow is a **real-time collaborative text editor** that empowers users to create, edit, and share documents effortlessly. Built with **Django** for the backend and **React with TypeScript** for the frontend, TextFlow provides a seamless and intuitive experience for document collaboration.

---

## 🚀 Features

- ✅ **Real-Time Collaboration**: Edit documents with multiple users simultaneously using WebSocket-based communication.
- ✅ **Role-Based Access Control**: Share documents with read-only or write permissions.
- ✅ **Version Control**: Undo and redo changes with a robust versioning system.
- ✅ **Rich Text Editing**: Support for text and image content blocks.
- ✅ **Dark Mode**: Toggle between light and dark themes for a comfortable user experience.
- ✅ **Secure Authentication**: User authentication with JWT.
- ✅ **Responsive Design**: Optimized for both desktop and mobile devices.

---

## 🛠️ Technologies Used

### 🌐 Backend

- **Django**: High-level Python web framework.
- **Django Channels**: Real-time communication with WebSocket support.
- **PostgreSQL**: Reliable relational database.
- **Redis**: Channel layer support for production.

### 🌐 Frontend

- **React + TypeScript**: Modern, type-safe UI development.
- **Vite**: Fast build tool for modern web projects.
- **Tailwind CSS**: Utility-first CSS framework.

---

## 🚀 Installation

### ⚡ Backend

1. **Clone the Repository**:

```bash
git clone <repository-url>
cd Text-Editor/backend
```

2. **Install Dependencies**:

```bash
pip install -r requirements.txt
```

3. **Configure Environment Variables**:

- Create a `.env` file in the `backend` directory.

```env
SECRET_KEY=<your-secret-key>
PGDATABASE=<your-database-name>
PGUSER=<your-database-user>
PGPASSWORD=<your-database-password>
PGHOST=<your-database-host>
PGPORT=<your-database-port>
```

4. **Apply Migrations**:

```bash
python manage.py migrate
```

5. **Run the Development Server**:

```bash
python manage.py runserver
```

### ⚡ Frontend

1. **Navigate to the Frontend Directory**:

```bash
cd ../frontend
```

2. **Install Dependencies**:

```bash
npm install
```

3. **Start the Development Server**:

```bash
npm run dev
```

---

## 🌐 Deployment

### 🚀 Backend

- Use platforms like [Railway](https://railway.app/) or [Heroku](https://www.heroku.com/).
- Ensure services are configured:
  - PostgreSQL
  - Redis (for production channel layers)

### 🚀 Frontend

- Deploy using [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).

---

## 📸 Screenshots

_Add screenshots here to showcase the application interface and features._

---

## 📜 License

This project is licensed under the **MIT License**. See the LICENSE file for details.
