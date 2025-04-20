# School Fees Management App

A React Native application for managing school fees, student information, class data, and bus expenditures. This application is built using Expo for a streamlined development experience.

## Features

- **Dashboard**: Overview of fee collection statistics and pending tasks
- **Fee Collection**: Record and manage student fee payments
- **Fee Recovery**: Track and manage fee defaulters
- **Student Management**: Add, edit, and delete student information
- **Class Management**: Organize students by class and section
- **Bus Expenditure**: Track and manage school bus expenses and vehicles
- **Reports**: Generate and view various financial reports
- **Settings**: Configure application settings

## Installation

1. Make sure you have Node.js and npm installed
2. Install Expo CLI globally:
   ```
   npm install -g expo-cli
   ```
3. Clone the repository
4. Navigate to the project directory:
   ```
   cd SchoolFeesApp
   ```
5. Install dependencies:
   ```
   npm install
   ```

## Running the Application

Start the Expo development server:

```
npx expo start
```

This will open the Expo DevTools in your browser. You can run the app by:

- Pressing `a` to run on an Android emulator or connected device
- Pressing `i` to run on an iOS simulator
- Pressing `w` to run in a web browser
- Scanning the QR code with the Expo Go app on your physical device

## Using the Application

### Login

Use the login screen to authenticate. For demo purposes, use:
- Username: admin
- Password: password

### Dashboard

The dashboard provides an overview of fee collection statistics, including:
- Monthly collection trends
- Defaulter statistics 
- Quick actions for common tasks

### Fee Collection

Record fee payments:
1. Search for a student by name or ID
2. Select the fee type and amount
3. Complete the payment and generate a receipt

### Student Management

Manage student information:
1. View all students in a tabular format
2. Filter students by class, section, or search term
3. Add new students with detailed information
4. Edit or delete existing student records

### Class Management

Organize and manage classes:
1. View all classes in a tabular format
2. Filter classes by section or search term
3. Add new classes with details like class teacher, room number
4. Edit or delete existing class records
5. View students within a specific class

### Bus Expenditure

Track school transportation expenses:
1. Record bus expenses with date, amount, and purpose
2. Manage vehicle information
3. View expense history by vehicle

## Troubleshooting

If you encounter navigation issues, try running the troubleshooting script:

```
node troubleshoot-navigation.js
```

For other common issues:

1. Clear the React Native cache:
   ```
   npx react-native start --reset-cache
   ```

2. Clear the Expo cache:
   ```
   expo r -c
   ```

## API Integration

This application is designed to connect with a .NET Core back-end API. Configuration for API endpoints can be found in:
```
src/services/api.js
```

## License

This project is licensed under the MIT License.
