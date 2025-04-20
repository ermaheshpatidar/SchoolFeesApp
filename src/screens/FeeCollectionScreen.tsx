import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for students
const mockStudents = [
  {
    id: '1',
    name: 'Arjun Patel',
    class: '10',
    section: 'A',
    rollNumber: '101',
    pendingFees: 15000,
    lastPayment: '15 Mar 2023',
  },
  {
    id: '2',
    name: 'Ravi Sharma',
    class: '10',
    section: 'B',
    rollNumber: '102',
    pendingFees: 25000,
    lastPayment: '10 Jan 2023',
  },
  {
    id: '3',
    name: 'Ananya Gupta',
    class: '9',
    section: 'A',
    rollNumber: '103',
    pendingFees: 0,
    lastPayment: '5 Apr 2023',
  },
];

// Payment modes
const paymentModes = [
  { id: 'cash', label: 'Cash', icon: 'cash-outline' },
  { id: 'online', label: 'Online Banking', icon: 'laptop-outline' },
  { id: 'upi', label: 'UPI', icon: 'phone-portrait-outline' },
  { id: 'cheque', label: 'Cheque', icon: 'document-text-outline' },
];

const FeeCollectionScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paymentMode, setPaymentMode] = useState('cash');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Filter students based on search
  const filteredStudents = mockStudents.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.rollNumber.includes(query) ||
      `${student.class}-${student.section}`.toLowerCase().includes(query)
    );
  });

  // Select a student for payment
  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setPaymentAmount(student.pendingFees.toString());
    setModalVisible(true);
  };

  // Handle payment submission
  const handlePayment = () => {
    if (!selectedStudent) {
      Alert.alert('Error', 'Please select a student.');
      return;
    }

    if (!paymentAmount || isNaN(parseFloat(paymentAmount)) || parseFloat(paymentAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid payment amount.');
      return;
    }

    if (!paymentReference && paymentMode !== 'cash') {
      Alert.alert('Error', 'Please enter a payment reference.');
      return;
    }

    // In a real app, this would make an API call to record the payment
    Alert.alert(
      'Payment Successful',
      `Payment of ₹${paymentAmount} received from ${selectedStudent.name} via ${
        paymentModes.find((mode) => mode.id === paymentMode).label
      }.`,
      [
        {
          text: 'View Receipt',
          onPress: () => {
            setModalVisible(false);
            navigation.navigate('Receipt', {
              student: selectedStudent,
              payment: {
                amount: parseFloat(paymentAmount),
                mode: paymentMode,
                reference: paymentReference,
                date: paymentDate,
              },
            });
          },
        },
        {
          text: 'New Payment',
          onPress: () => {
            setModalVisible(false);
            setSelectedStudent(null);
            setPaymentAmount('');
            setPaymentReference('');
            setPaymentMode('cash');
          },
        },
      ]
    );
  };

  // Render student item as grid row
  const renderStudentItem = ({ item }) => (
    <TouchableOpacity
      style={styles.studentGridItem}
      onPress={() => handleSelectStudent(item)}
    >
      <View style={styles.studentGridRow}>
        <Text style={styles.studentGridName}>{item.name}</Text>
        <Text style={styles.studentGridClass}>
          Class {item.class}-{item.section}
        </Text>
        <Text style={styles.studentGridRoll}>Roll: {item.rollNumber}</Text>
        <Text
          style={[
            styles.studentGridFee,
            item.pendingFees > 0 ? styles.pendingFeePositive : styles.pendingFeeZero,
          ]}
        >
          ₹{item.pendingFees}
        </Text>
        <TouchableOpacity
          style={styles.collectionButton}
          onPress={() => handleSelectStudent(item)}
        >
          <Ionicons name="cash-outline" size={16} color="#fff" />
          <Text style={styles.collectionButtonText}>Collect</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fee Collection</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search student by name, roll number, or class"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.gridHeaderContainer}>
        <Text style={styles.gridHeaderCell}>Name</Text>
        <Text style={styles.gridHeaderCell}>Class</Text>
        <Text style={styles.gridHeaderCell}>Roll No</Text>
        <Text style={styles.gridHeaderCell}>Pending</Text>
        <Text style={styles.gridHeaderCell}>Action</Text>
      </View>

      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id}
        renderItem={renderStudentItem}
        style={styles.studentsList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No students found</Text>
        }
      />

      {/* Payment Form Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Fee Collection</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {selectedStudent && (
              <ScrollView style={styles.modalContent}>
                <View style={styles.studentSummary}>
                  <Text style={styles.summaryName}>{selectedStudent.name}</Text>
                  <Text style={styles.summaryClass}>
                    Class {selectedStudent.class}-{selectedStudent.section} | Roll: {selectedStudent.rollNumber}
                  </Text>
                  <View style={styles.pendingContainer}>
                    <Text style={styles.pendingLabel}>Pending Fee:</Text>
                    <Text style={styles.pendingValue}>₹{selectedStudent.pendingFees}</Text>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Payment Amount (₹)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={paymentAmount}
                    onChangeText={setPaymentAmount}
                    keyboardType="numeric"
                    placeholder="Enter payment amount"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Payment Date</Text>
                  <TextInput
                    style={styles.textInput}
                    value={paymentDate}
                    onChangeText={setPaymentDate}
                    placeholder="YYYY-MM-DD"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Payment Mode</Text>
                  <View style={styles.paymentModes}>
                    {paymentModes.map((mode) => (
                      <TouchableOpacity
                        key={mode.id}
                        style={[
                          styles.paymentModeItem,
                          paymentMode === mode.id && styles.selectedPaymentMode,
                        ]}
                        onPress={() => setPaymentMode(mode.id)}
                      >
                        <Ionicons
                          name="cash-outline"
                          size={24}
                          color={paymentMode === mode.id ? '#3f51b5' : '#666'}
                        />
                        <Text
                          style={[
                            styles.paymentModeText,
                            paymentMode === mode.id && styles.selectedPaymentModeText,
                          ]}
                        >
                          {mode.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {paymentMode !== 'cash' && (
                  <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>
                      {paymentMode === 'cheque' ? 'Cheque Number' : 'Transaction Reference'}
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      value={paymentReference}
                      onChangeText={setPaymentReference}
                      placeholder={
                        paymentMode === 'cheque'
                          ? 'Enter cheque number'
                          : 'Enter transaction reference'
                      }
                    />
                  </View>
                )}

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handlePayment}
                >
                  <Text style={styles.submitButtonText}>Collect Payment</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3f51b5',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
  },
  gridHeaderContainer: {
    flexDirection: 'row',
    backgroundColor: '#3f51b5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  gridHeaderCell: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
  },
  studentsList: {
    paddingHorizontal: 16,
  },
  studentGridItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  studentGridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  studentGridName: {
    flex: 1,
    fontWeight: 'bold',
    color: '#333',
  },
  studentGridClass: {
    flex: 1,
    color: '#666',
  },
  studentGridRoll: {
    flex: 1,
    color: '#666',
  },
  studentGridFee: {
    flex: 1,
    fontWeight: 'bold',
  },
  collectionButton: {
    backgroundColor: '#3f51b5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    flex: 1,
  },
  collectionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 12,
  },
  pendingFeePositive: {
    color: '#ff9500',
  },
  pendingFeeZero: {
    color: '#4cd964',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
  },
  studentSummary: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  summaryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  summaryClass: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  pendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  pendingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff9500',
  },
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  paymentModes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  paymentModeItem: {
    width: '25%',
    paddingHorizontal: 4,
    marginBottom: 8,
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  selectedPaymentMode: {
    backgroundColor: '#e8eaf6',
    borderColor: '#3f51b5',
  },
  paymentModeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  selectedPaymentModeText: {
    color: '#3f51b5',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#3f51b5',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FeeCollectionScreen; 