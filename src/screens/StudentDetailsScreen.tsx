import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock student data
const studentData = {
  id: '12345',
  name: 'Rahul Kumar',
  rollNumber: 'R2023001',
  class: '10th',
  section: 'A',
  admissionNumber: 'ADM-2023-1001',
  dateOfBirth: '10/05/2007',
  gender: 'Male',
  fatherName: 'Rajesh Kumar',
  motherName: 'Priya Kumar',
  address: '123, Park Street, Delhi',
  contactNumber: '9876543210',
  email: 'parent@example.com',
  bloodGroup: 'O+',
  admissionDate: '01/04/2023',
  feeStatus: 'Paid',
  lastFeePaid: '15/07/2023',
  dueAmount: '₹0',
  feeStructure: 'Regular',
  transportation: true,
  busRoute: 'Route 3',
  busStop: 'Sector 15',
  busCharges: '₹1,500 per quarter',
  image: 'https://via.placeholder.com/150',
  feesHistory: [
    { id: 1, date: '15/07/2023', amount: '₹15,000', type: 'Tuition Fee', status: 'Paid', receipt: 'RCPT-1001' },
    { id: 2, date: '15/04/2023', amount: '₹15,000', type: 'Tuition Fee', status: 'Paid', receipt: 'RCPT-982' },
    { id: 3, date: '15/01/2023', amount: '₹15,000', type: 'Tuition Fee', status: 'Paid', receipt: 'RCPT-768' },
    { id: 4, date: '15/07/2023', amount: '₹4,500', type: 'Transportation Fee', status: 'Paid', receipt: 'RCPT-1002' },
    { id: 5, date: '15/04/2023', amount: '₹4,500', type: 'Transportation Fee', status: 'Paid', receipt: 'RCPT-983' },
  ],
  attendance: {
    present: 85,
    absent: 5,
    leave: 3,
    total: 93,
    percentage: '91.4%',
  },
};

const StudentDetailsScreen = ({ route, navigation }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Get studentId from route params or use default for mock data
  const { studentId } = route.params || { studentId: '12345' };
  
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setStudent(studentData);
      setLoading(false);
    }, 1000);
    
    // Set navigation options
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Student Details',
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#3f51b5',
      },
      headerTintColor: '#fff',
      headerLeft: () => (
        <TouchableOpacity 
          style={{ paddingLeft: 16 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity 
          style={{ paddingRight: 16 }}
          onPress={() => Alert.alert('Edit', 'Edit student functionality will be implemented soon.')}
        >
          <Ionicons name="create-outline" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, studentId]);
  
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3f51b5" />
        <Text style={styles.loaderText}>Loading student details...</Text>
      </View>
    );
  }
  
  if (!student) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#f44336" />
        <Text style={styles.errorText}>Student not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: student.image }} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentClass}>{`Class ${student.class} - ${student.section}`}</Text>
          <View style={styles.studentMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="card-outline" size={16} color="#666" />
              <Text style={styles.metaText}>{student.rollNumber}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.metaText}>{student.admissionDate}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Details</Text>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date of Birth</Text>
            <Text style={styles.detailValue}>{student.dateOfBirth}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Gender</Text>
            <Text style={styles.detailValue}>{student.gender}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Blood Group</Text>
            <Text style={styles.detailValue}>{student.bloodGroup}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Admission No.</Text>
            <Text style={styles.detailValue}>{student.admissionNumber}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Father's Name</Text>
            <Text style={styles.detailValue}>{student.fatherName}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Mother's Name</Text>
            <Text style={styles.detailValue}>{student.motherName}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Contact Number</Text>
            <Text style={styles.detailValue}>{student.contactNumber}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{student.email}</Text>
          </View>
          <View style={[styles.detailItem, { width: '100%' }]}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>{student.address}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transportation</Text>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Uses School Bus</Text>
            <Text style={styles.detailValue}>{student.transportation ? 'Yes' : 'No'}</Text>
          </View>
          {student.transportation && (
            <>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Bus Route</Text>
                <Text style={styles.detailValue}>{student.busRoute}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Bus Stop</Text>
                <Text style={styles.detailValue}>{student.busStop}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Bus Charges</Text>
                <Text style={styles.detailValue}>{student.busCharges}</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
  
  const renderFeesTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.feesSummary}>
        <View style={[styles.feeSummaryCard, { backgroundColor: '#e8f5e9' }]}>
          <Text style={styles.feeSummaryLabel}>Fee Status</Text>
          <Text style={[styles.feeSummaryValue, { color: '#4caf50' }]}>{student.feeStatus}</Text>
        </View>
        <View style={[styles.feeSummaryCard, { backgroundColor: '#e3f2fd' }]}>
          <Text style={styles.feeSummaryLabel}>Last Paid</Text>
          <Text style={[styles.feeSummaryValue, { color: '#2196f3' }]}>{student.lastFeePaid}</Text>
        </View>
        <View style={[styles.feeSummaryCard, { backgroundColor: student.dueAmount === '₹0' ? '#e8f5e9' : '#fff3e0' }]}>
          <Text style={styles.feeSummaryLabel}>Due Amount</Text>
          <Text 
            style={[
              styles.feeSummaryValue, 
              { color: student.dueAmount === '₹0' ? '#4caf50' : '#ff9800' }
            ]}
          >
            {student.dueAmount}
          </Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Payment History</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {student.feesHistory.map((fee, index) => (
          <View key={fee.id} style={[styles.paymentItem, index === student.feesHistory.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentType}>{fee.type}</Text>
              <Text style={styles.paymentDate}>{fee.date}</Text>
            </View>
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentAmount}>{fee.amount}</Text>
              <View style={[styles.paymentStatusBadge, { backgroundColor: fee.status === 'Paid' ? '#e8f5e9' : '#fff3e0' }]}>
                <Text 
                  style={[
                    styles.paymentStatusText, 
                    { color: fee.status === 'Paid' ? '#4caf50' : '#ff9800' }
                  ]}
                >
                  {fee.status}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.receiptButton}
              onPress={() => navigation.navigate('Receipt', { receiptId: fee.receipt })}
            >
              <Ionicons name="receipt-outline" size={20} color="#3f51b5" />
              <Text style={styles.receiptButtonText}>Receipt</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#3f51b5' }]}>
          <Ionicons name="cash-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Collect Fee</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#f5f5f5' }]}>
          <Ionicons name="document-text-outline" size={20} color="#333" />
          <Text style={[styles.actionButtonText, { color: '#333' }]}>Fee Structure</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderAttendanceTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.attendanceSummary}>
        <View style={styles.attendanceProgressContainer}>
          <View style={styles.attendanceProgressOuter}>
            <View 
              style={[
                styles.attendanceProgressInner, 
                { width: `${student.attendance.percentage.replace('%', '')}%` }
              ]}
            />
          </View>
          <Text style={styles.attendancePercentage}>{student.attendance.percentage} Attendance</Text>
        </View>
        
        <View style={styles.attendanceStats}>
          <View style={[styles.attendanceStatCard, { backgroundColor: '#e8f5e9' }]}>
            <Text style={styles.attendanceStatValue}>{student.attendance.present}</Text>
            <Text style={styles.attendanceStatLabel}>Present</Text>
          </View>
          <View style={[styles.attendanceStatCard, { backgroundColor: '#ffebee' }]}>
            <Text style={styles.attendanceStatValue}>{student.attendance.absent}</Text>
            <Text style={styles.attendanceStatLabel}>Absent</Text>
          </View>
          <View style={[styles.attendanceStatCard, { backgroundColor: '#fff8e1' }]}>
            <Text style={styles.attendanceStatValue}>{student.attendance.leave}</Text>
            <Text style={styles.attendanceStatLabel}>Leave</Text>
          </View>
          <View style={[styles.attendanceStatCard, { backgroundColor: '#e3f2fd' }]}>
            <Text style={styles.attendanceStatValue}>{student.attendance.total}</Text>
            <Text style={styles.attendanceStatLabel}>Total Days</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monthly Attendance</Text>
        <Text style={styles.notImplementedText}>Monthly attendance report will be shown here.</Text>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="person-outline" 
            size={20} 
            color={activeTab === 'profile' ? '#3f51b5' : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'profile' && styles.activeTabText
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'fees' && styles.activeTab]}
          onPress={() => setActiveTab('fees')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="cash-outline" 
            size={20} 
            color={activeTab === 'fees' ? '#3f51b5' : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'fees' && styles.activeTabText
            ]}
          >
            Fees
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'attendance' && styles.activeTab]}
          onPress={() => setActiveTab('attendance')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="calendar-outline" 
            size={20} 
            color={activeTab === 'attendance' ? '#3f51b5' : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'attendance' && styles.activeTabText
            ]}
          >
            Attendance
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'fees' && renderFeesTab()}
        {activeTab === 'attendance' && renderAttendanceTab()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: '#f44336',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#3f51b5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#f0f2ff',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#3f51b5',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'center',
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  studentClass: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  studentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  detailItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
  feesSummary: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  feeSummaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  feeSummaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  feeSummaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAllButton: {
    paddingHorizontal: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: '#3f51b5',
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentType: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 12,
    color: '#666',
  },
  paymentDetails: {
    alignItems: 'flex-end',
    marginRight: 16,
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  paymentStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  receiptButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#3f51b5',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  attendanceSummary: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  attendanceProgressContainer: {
    marginBottom: 16,
  },
  attendanceProgressOuter: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 8,
  },
  attendanceProgressInner: {
    height: 8,
    backgroundColor: '#4caf50',
    borderRadius: 4,
  },
  attendancePercentage: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  attendanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  attendanceStatCard: {
    width: '23%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  attendanceStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  attendanceStatLabel: {
    fontSize: 12,
    color: '#666',
  },
  notImplementedText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    paddingVertical: 24,
  },
});

export default StudentDetailsScreen; 