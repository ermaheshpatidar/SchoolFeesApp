// API base URL - Replace with your actual API endpoint in production
const API_BASE_URL = 'https://api.schoolfeesapp.example.com/api';

// Add a timeout for fetch calls
const FETCH_TIMEOUT = 15000;

// Helper function to add timeout to fetch
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = FETCH_TIMEOUT): Promise<Response> => {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) => 
      setTimeout(() => reject(new Error('Request timed out')), timeout)
    )
  ]);
};

// Helper function to handle API requests
const apiRequest = async (endpoint: string, method: string = 'GET', data: any = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  // Add authorization header if we have a token
  // Note: For React Native, you'd use AsyncStorage instead of localStorage
  const token = '';  // Replace with AsyncStorage.getItem('authToken')
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  // Add body if we have data
  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    // Make the API call
    const response = await fetchWithTimeout(url, options);
    
    // Parse the JSON response
    const responseData = await response.json();
    
    // Check for error responses
    if (!response.ok) {
      throw new Error(responseData.message || 'Something went wrong');
    }
    
    return responseData;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Authentication functions
export const loginUser = async (username: string, password: string) => {
  // For demo purposes, check for dummy credentials
  if (username === 'admin' && password === 'password') {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a mock successful response
    return {
      success: true,
      token: 'mock-jwt-token',
      user: {
        id: 1,
        username: 'admin',
        name: 'Admin User',
        role: 'admin',
      }
    };
  }
  
  try {
    // In a real app, this would call the actual API
    // For demo, we'll throw an error for any other credentials
    await new Promise(resolve => setTimeout(resolve, 1000));
    throw new Error('Invalid username or password');
  } catch (error) {
    throw error;
  }
};

// Student related functions
export const fetchStudents = async (filters = {}) => {
  try {
    // For demo, we'll return mock data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This would be an API call in a real app
    // return await apiRequest('/students', 'GET');
    
    // Return mock data
    return {
      success: true,
      data: [
        {
          id: '1',
          name: 'Jai Patidar',
          rollNumber: '101',
          class: '10',
          section: 'A',
          parentName: 'Rohit Patidar',
          contactNumber: '9876543210',
          admissionNumber: 'ADM001',
          pendingFees: 15000,
          lastPayment: '15 Mar 2023',
        },
        {
          id: '2',
          name: 'Jagdish Sharma',
          rollNumber: '102',
          class: '10',
          section: 'B',
          parentName: 'Nandlal Sharma',
          contactNumber: '9876543211',
          admissionNumber: 'ADM002',
          pendingFees: 25000,
          lastPayment: '10 Jan 2023',
        },
        {
          id: '3',
          name: 'Anil Kumar',
          rollNumber: '103',
          class: '9',
          section: 'A',
          parentName: 'Pushpendra Kumar',
          contactNumber: '9876543212',
          admissionNumber: 'ADM003',
          pendingFees: 0,
          lastPayment: '5 Apr 2023',
        },
        {
          id: '4',
          name: 'Surbhi Patidar',
          rollNumber: '104',
          class: '11',
          section: 'A',
          parentName: 'NandKishore Patidar',
          contactNumber: '9876543213',
          admissionNumber: 'ADM004',
          pendingFees: 18000,
          lastPayment: '22 Feb 2023',
        },
        {
          id: '5',
          name: 'Kamal Singh',
          rollNumber: '105',
          class: '12',
          section: 'B',
          parentName: 'Ram singh',
          contactNumber: '9876543214',
          admissionNumber: 'ADM005',
          pendingFees: 8000,
          lastPayment: '18 Mar 2023',
        },
      ],
    };
  } catch (error) {
    throw error;
  }
};

// Fee related functions
export const fetchFeeStructures = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      data: [
        {
          id: '1',
          name: 'Standard Fee Structure',
          class: 'All Classes',
          tuitionFee: 25000,
          busFee: 5000,
          libraryFee: 2000,
          sportsFee: 3000,
          examFee: 1500,
          totalFee: 36500,
        },
        {
          id: '2',
          name: 'Class 11-12 Fee Structure',
          class: 'Class 11-12',
          tuitionFee: 35000,
          busFee: 5000,
          libraryFee: 3000,
          sportsFee: 3000,
          examFee: 2000,
          totalFee: 48000,
        },
        {
          id: '3',
          name: 'Primary Classes Fee',
          class: 'Class 1-5',
          tuitionFee: 20000,
          busFee: 5000,
          libraryFee: 1000,
          sportsFee: 2000,
          examFee: 1000,
          totalFee: 29000,
        },
      ],
    };
  } catch (error) {
    throw error;
  }
};

export const makePayment = async (studentId: string, amount: number, paymentDetails: any) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return {
      success: true,
      data: {
        id: String(Date.now()),
        studentId,
        amount,
        date: new Date().toISOString(),
        paymentMode: paymentDetails.mode,
        reference: paymentDetails.reference || '',
        status: 'completed',
      },
    };
  } catch (error) {
    throw error;
  }
};

// Bus related functions
export const fetchBuses = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 900));
    
    return {
      success: true,
      data: [
        {
          id: '1',
          name: 'Bus 1',
          regNumber: 'MH01-AB-1234',
          driver: 'John Driver',
          capacity: '40',
          status: 'Active',
          students: 35,
        },
        {
          id: '2',
          name: 'Bus 2',
          regNumber: 'MH01-CD-5678',
          driver: 'Mike Driver',
          capacity: '30',
          status: 'Active',
          students: 28,
        },
        {
          id: '3',
          name: 'Bus 3',
          regNumber: 'MH01-EF-9012',
          driver: 'Dave Driver',
          capacity: '40',
          status: 'Maintenance',
          students: 0,
        }
      ],
    };
  } catch (error) {
    throw error;
  }
};

export const fetchBusExpenses = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      expenses: [
        {
          id: '1',
          date: '2023-04-15',
          amount: 2500,
          description: 'Fuel refill',
          vehicleId: '1',
        },
        {
          id: '2',
          date: '2023-04-10',
          amount: 1200,
          description: 'Oil change and filter',
          vehicleId: '2',
        },
        {
          id: '3',
          date: '2023-04-05',
          amount: 3500,
          description: 'Tire replacement',
          vehicleId: '1',
        },
        {
          id: '4',
          date: '2023-04-01',
          amount: 800,
          description: 'Windshield wipers',
          vehicleId: '3',
        },
        {
          id: '5',
          date: '2023-03-28',
          amount: 4500,
          description: 'Monthly maintenance',
          vehicleId: '2',
        },
      ],
      vehicles: [
        {
          id: '1',
          name: 'Bus 1',
          regNumber: 'MH01-AB-1234',
          driver: 'John Driver',
          capacity: '40',
          status: 'Active',
        },
        {
          id: '2',
          name: 'Bus 2',
          regNumber: 'MH01-CD-5678',
          driver: 'Mike Driver',
          capacity: '30',
          status: 'Active',
        },
        {
          id: '3',
          name: 'Bus 3',
          regNumber: 'MH01-EF-9012',
          driver: 'Dave Driver',
          capacity: '40',
          status: 'Maintenance',
        },
      ],
    };
  } catch (error) {
    throw error;
  }
};

// Reports related functions
export const fetchReportData = async (reportType: string, filters: any = {}) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock data for different report types
    const reportData = {
      'daily': [
        { id: '1', date: '15 Apr 2023', amount: 25000, students: 10, mode: 'Cash' },
        { id: '2', date: '16 Apr 2023', amount: 35000, students: 15, mode: 'Online' },
        { id: '3', date: '17 Apr 2023', amount: 15000, students: 6, mode: 'Cash' },
      ],
      'monthly': [
        { id: '1', date: 'April 2023', amount: 120000, students: 48, mode: 'Mixed' },
        { id: '2', date: 'March 2023', amount: 105000, students: 42, mode: 'Mixed' },
        { id: '3', date: 'February 2023', amount: 98000, students: 39, mode: 'Mixed' },
      ],
      'class-wise': [
        { id: '1', date: 'Class 10', amount: 75000, students: 30, mode: 'Mixed' },
        { id: '2', date: 'Class 11', amount: 82000, students: 25, mode: 'Mixed' },
        { id: '3', date: 'Class 12', amount: 90000, students: 22, mode: 'Mixed' },
      ],
      'pending': [
        { id: '1', date: 'Class 10', amount: 45000, students: 18, mode: 'Pending' },
        { id: '2', date: 'Class 11', amount: 38000, students: 15, mode: 'Pending' },
        { id: '3', date: 'Class 12', amount: 52000, students: 20, mode: 'Pending' },
      ],
      'bus-expenses': [
        { id: '1', date: 'Bus 1', amount: 12000, students: 35, mode: 'Expenses' },
        { id: '2', date: 'Bus 2', amount: 10000, students: 28, mode: 'Expenses' },
        { id: '3', date: 'Bus 3', amount: 8000, students: 0, mode: 'Expenses' },
      ],
    };
    
    return {
      success: true,
      data: reportData[reportType] || reportData['daily'], // Default to daily if not found
    };
  } catch (error) {
    throw error;
  }
};

export default {
  loginUser,
  fetchStudents,
  fetchFeeStructures,
  makePayment,
  fetchBuses,
  fetchBusExpenses,
  fetchReportData
}; 