# TaskMate Connect 📱

A modern React Native task management application with a beautiful UI for teachers and students to create, assign, and track tasks.

## 🚀 Features

### ✨ Modern UI/UX
- **Beautiful Design** - Modern card-based interface with smooth animations
- **Responsive Layout** - Works perfectly on mobile devices and simulators
- **Intuitive Navigation** - Easy-to-use interface with clear visual hierarchy
- **Dark/Light Theme Support** - Consistent color scheme throughout

### 👨‍🏫 Teacher Features
- **Create Tasks** - Easy task creation with title, description, and student assignment
- **Assign to Students** - Select specific students from a dropdown list
- **View All Tasks** - See all created tasks with their status
- **Delete Tasks** - Remove tasks with confirmation dialog
- **Task Statistics** - View active and completed task counts

### 👨‍🎓 Student Features
- **View Assigned Tasks** - See tasks specifically assigned to you
- **Mark Tasks Complete** - Mark tasks as done with one tap
- **Task Details** - Expandable task cards with full descriptions
- **Progress Tracking** - See your task completion progress

### 🔧 Technical Features
- **Real-time Updates** - Tasks update immediately after actions
- **Offline Support** - AsyncStorage for data persistence
- **Network Error Handling** - Graceful error handling with user feedback
- **Form Validation** - Input validation with helpful error messages

## 📱 Screenshots

### Login Screen
- Modern login interface with email/password fields
- Password visibility toggle
- Error handling with visual feedback
- Sign up navigation

### Home Screen
- User profile header with avatar and role
- Statistics dashboard showing task counts
- Collapsible task creation form (teachers)
- Card-based task list with smooth animations

### Task Cards
- Expandable task details
- Status indicators
- Action buttons (complete/delete)
- Beautiful animations and transitions

## 🛠️ Tech Stack

### Frontend
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **React Navigation** - Navigation between screens
- **AsyncStorage** - Local data persistence
- **Expo Vector Icons** - Beautiful icon library

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **Supabase** - Database and authentication
- **PM2** - Process management

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **iOS Simulator** (for iOS development)
- **Android Studio** (for Android development)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd taskmate-connect
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```bash
BASE_URL=http://YOUR_LOCAL_IP:3000/
```

**To find your local IP address:**
```bash
# On macOS
ipconfig getifaddr en0

# On Windows
ipconfig

# On Linux
hostname -I
```

### 4. Start the Backend Server
```bash
cd ../taskmate-backend
npm install
npm run dev
```

**Or use PM2 for production-like management:**
```bash
npm install -g pm2
pm2 start npm --name "taskmate-backend" -- run dev
```

### 5. Start the Frontend
```bash
cd ../taskmate-connect
npm start
```

## 📱 Running the App

### Development
```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web
```

### Production Build
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

## 🔧 Configuration

### Backend Configuration
The backend server runs on port 3000 by default. You can change this in `taskmate-backend/index.js`:

```javascript
const PORT = process.env.PORT || 3000;
```

### Frontend Configuration
Update the `BASE_URL` in your `.env` file to match your backend server address.

## 📊 API Endpoints

### Authentication
- `POST /login` - User login
- `POST /users/create` - User registration

### Tasks
- `GET /tasks` - Get all tasks
- `POST /tasks/create` - Create new task
- `PATCH /tasks/:id` - Update task status
- `DELETE /tasks/:id` - Delete task

### Users
- `GET /users` - Get all users
- `POST /users/create` - Create new user

### Completed Tasks
- `POST /completeTasks/create` - Mark task as complete

## 🎨 UI Components

### HomeScreen
- Modern header with user info and avatar
- Statistics cards showing task counts
- Collapsible task creation form
- Card-based task list

### LoginScreen
- Clean login interface
- Password visibility toggle
- Error handling
- Navigation to sign up

### Accordion
- Expandable task cards
- Smooth animations
- Action buttons
- Status indicators

## 🔍 Troubleshooting

### Common Issues

#### 1. Network Connection Error
**Problem:** "Network error. Please check your connection."
**Solution:** 
- Verify backend server is running: `curl http://YOUR_IP:3000/`
- Check `.env` file has correct `BASE_URL`
- Ensure both devices are on same network

#### 2. Port Already in Use
**Problem:** "Error: listen EADDRINUSE: address already in use :::3000"
**Solution:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 <PID>

# Or use PM2
pm2 stop taskmate-backend
pm2 start taskmate-backend
```

#### 3. Expo Cache Issues
**Problem:** App not loading new changes
**Solution:**
```bash
# Clear Expo cache
npx expo start --clear

# Or reset cache completely
npx expo r -c
```

#### 4. Font Loading Issues
**Problem:** App stuck on loading screen
**Solution:** The app now uses system fonts instead of custom fonts for better reliability.

### Development Tips

1. **Use PM2 for Backend Management:**
   ```bash
   pm2 start npm --name "taskmate-backend" -- run dev
   pm2 logs taskmate-backend
   pm2 restart taskmate-backend
   ```

2. **Check Network Connectivity:**
   ```bash
   # Test backend from terminal
   curl http://YOUR_IP:3000/
   ```

3. **Monitor Expo Logs:**
   - Check the Expo development server console for errors
   - Use React Native Debugger for detailed debugging

## 📝 Project Structure

```
taskmate-connect/
├── components/
│   ├── HomeScreen.js      # Main dashboard
│   ├── LoginScreen.js     # Authentication
│   ├── SignUpScreen.js    # User registration
│   ├── Accordion.js       # Task cards
│   ├── CompleteTaskScreen.js
│   └── SplashScreen.js
├── assets/                # Images and icons
├── App.js                 # Main app component
├── .env                   # Environment variables
├── package.json
└── README.md

taskmate-backend/
├── index.js              # Main server file
├── middleware/           # Custom middleware
├── prisma/              # Database schema
├── supabase/            # Database configuration
└── package.json
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo** for the amazing development platform
- **React Native** community for excellent documentation
- **Material Design** for UI inspiration
- **PM2** for process management

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the API documentation in `taskmate-backend/API.md`
3. Create an issue in the repository
4. Contact the development team

---

**Happy Task Managing! 🎉** 