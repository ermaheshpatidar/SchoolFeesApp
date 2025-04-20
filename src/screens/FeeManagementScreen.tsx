import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for fee structures
const mockFeeStructures = [
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
];

const FeeManagementScreen = ({ navigation }) => {
  const [feeStructures, setFeeStructures] = useState(mockFeeStructures);
  const [modalVisible, setModalVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [currentFeeStructure, setCurrentFeeStructure] = useState({
    id: '',
    name: '',
    class: '',
    tuitionFee: 0,
    busFee: 0,
    libraryFee: 0,
    sportsFee: 0,
    examFee: 0,
    totalFee: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('feeStructure'); // 'feeStructure' or 'sessionFees'
  const [academicYears, setAcademicYears] = useState(['2023-2024', '2022-2023']);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2023-2024');
  const [sessions, setSessions] = useState([
    { id: '1', name: 'First Term', startDate: '2023-04-01', endDate: '2023-08-31' },
    { id: '2', name: 'Second Term', startDate: '2023-09-01', endDate: '2023-12-31' },
    { id: '3', name: 'Third Term', startDate: '2024-01-01', endDate: '2024-03-31' },
  ]);
  const [selectedSession, setSelectedSession] = useState('1');
  const [studentFees, setStudentFees] = useState([
    {
      id: '1',
      studentId: '101',
      studentName: 'Rahul Kumar',
      class: '10',
      section: 'A',
      feeStructureId: '1',
      academicYear: '2023-2024',
      sessions: [
        {
          sessionId: '1',
          amount: 15000,
          paid: 15000,
          balance: 0,
          status: 'Paid',
          dueDate: '2023-06-15',
          transactions: [
            { id: '1', date: '2023-05-10', amount: 15000, mode: 'Cash', receipt: 'R001' }
          ]
        },
        {
          sessionId: '2',
          amount: 15000,
          paid: 0,
          balance: 15000,
          status: 'Pending',
          dueDate: '2023-10-15',
          transactions: []
        },
        {
          sessionId: '3',
          amount: 15000,
          paid: 0,
          balance: 15000,
          status: 'Not Due',
          dueDate: '2024-01-15',
          transactions: []
        }
      ]
    },
    {
      id: '2',
      studentId: '102',
      studentName: 'Priya Sharma',
      class: '10',
      section: 'B',
      feeStructureId: '1',
      academicYear: '2023-2024',
      sessions: [
        {
          sessionId: '1',
          amount: 15000,
          paid: 15000,
          balance: 0,
          status: 'Paid',
          dueDate: '2023-06-15',
          transactions: [
            { id: '2', date: '2023-05-15', amount: 15000, mode: 'Bank Transfer', receipt: 'R002' }
          ]
        },
        {
          sessionId: '2',
          amount: 15000,
          paid: 7500,
          balance: 7500,
          status: 'Partial',
          dueDate: '2023-10-15',
          transactions: [
            { id: '3', date: '2023-09-20', amount: 7500, mode: 'Cheque', receipt: 'R003' }
          ]
        },
        {
          sessionId: '3',
          amount: 15000,
          paid: 0,
          balance: 15000,
          status: 'Not Due',
          dueDate: '2024-01-15',
          transactions: []
        }
      ]
    }
  ]);
  const [filteredStudentFees, setFilteredStudentFees] = useState([]);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

  // Filter fee structures based on search
  const filteredFeeStructures = feeStructures.filter((fee) => {
    return fee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fee.class.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Calculate total fee
  const calculateTotal = (feeObj) => {
    return (
      parseInt(feeObj.tuitionFee || 0) +
      parseInt(feeObj.busFee || 0) +
      parseInt(feeObj.libraryFee || 0) +
      parseInt(feeObj.sportsFee || 0) +
      parseInt(feeObj.examFee || 0)
    );
  };

  // Open modal for adding a new fee structure
  const handleAddFeeStructure = () => {
    setCurrentFeeStructure({
      id: '',
      name: '',
      class: '',
      tuitionFee: 0,
      busFee: 0,
      libraryFee: 0,
      sportsFee: 0,
      examFee: 0,
      totalFee: 0,
    });
    setIsEditing(false);
    setModalVisible(true);
  };

  // Open modal for editing a fee structure
  const handleEditFeeStructure = (feeStructure) => {
    setCurrentFeeStructure(feeStructure);
    setIsEditing(true);
    setModalVisible(true);
  };

  // Delete a fee structure
  const handleDeleteFeeStructure = (id) => {
    setFeeStructures(feeStructures.filter((fee) => fee.id !== id));
  };

  // Update fee component
  const handleFeeChange = (field, value) => {
    const updatedFee = {
      ...currentFeeStructure,
      [field]: value,
    };
    
    // Calculate the new total
    updatedFee.totalFee = calculateTotal(updatedFee);
    
    setCurrentFeeStructure(updatedFee);
  };

  // Save fee structure (add or update)
  const handleSaveFeeStructure = () => {
    if (isEditing) {
      // Update existing fee structure
      setFeeStructures(
        feeStructures.map((fee) =>
          fee.id === currentFeeStructure.id ? currentFeeStructure : fee
        )
      );
    } else {
      // Add new fee structure
      const newFee = {
        ...currentFeeStructure,
        id: Date.now().toString(),
      };
      setFeeStructures([...feeStructures, newFee]);
    }
    setModalVisible(false);
  };

  // Open modal to assign fee structure to students/classes
  const handleAssignFeeStructure = (feeStructure) => {
    setCurrentFeeStructure(feeStructure);
    setAssignModalVisible(true);
  };

  // Filter student fees data
  const filterStudentFees = () => {
    let filtered = studentFees.filter(fee => fee.academicYear === selectedAcademicYear);
    
    if (studentSearchQuery) {
      filtered = filtered.filter(fee => 
        fee.studentName.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
        `${fee.class}-${fee.section}`.toLowerCase().includes(studentSearchQuery.toLowerCase())
      );
    }
    
    setFilteredStudentFees(filtered);
  };

  // Create a handler for paying fees
  const handlePayFees = (studentFee) => {
    navigation.navigate('Payment', { studentId: studentFee.studentId, sessionId: selectedSession });
  };

  // Create a handler for viewing fee details
  const handleViewFeeDetails = (studentFee) => {
    // Open a modal or navigate to fee details screen
    Alert.alert('Fee Details', `Viewing fee details for ${studentFee.studentName}`);
  };

  // Add filtering effect for student fees based on academic year, session, and search
  useEffect(() => {
    filterStudentFees();
  }, [selectedAcademicYear, selectedSession, studentSearchQuery, studentFees]);

  // Render fee structure item
  const renderFeeStructureItem = ({ item }) => (
    <View style={styles.feeCard}>
      <View style={styles.feeHeader}>
        <Text style={styles.feeName}>{item.name}</Text>
        <Text style={styles.feeClass}>{item.class}</Text>
      </View>
      
      <View style={styles.feeDetails}>
        <View style={styles.feeItem}>
          <Text style={styles.feeLabel}>Tuition Fee:</Text>
          <Text style={styles.feeValue}>₹{item.tuitionFee}</Text>
        </View>
        
        <View style={styles.feeItem}>
          <Text style={styles.feeLabel}>Bus Fee:</Text>
          <Text style={styles.feeValue}>₹{item.busFee}</Text>
        </View>
        
        <View style={styles.feeItem}>
          <Text style={styles.feeLabel}>Library Fee:</Text>
          <Text style={styles.feeValue}>₹{item.libraryFee}</Text>
        </View>
        
        <View style={styles.feeItem}>
          <Text style={styles.feeLabel}>Sports Fee:</Text>
          <Text style={styles.feeValue}>₹{item.sportsFee}</Text>
        </View>
        
        <View style={styles.feeItem}>
          <Text style={styles.feeLabel}>Exam Fee:</Text>
          <Text style={styles.feeValue}>₹{item.examFee}</Text>
        </View>
        
        <View style={[styles.feeItem, styles.totalFeeItem]}>
          <Text style={styles.totalFeeLabel}>Total Fee:</Text>
          <Text style={styles.totalFeeValue}>₹{item.totalFee}</Text>
        </View>
      </View>
      
      <View style={styles.feeActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.assignButton]}
          onPress={() => handleAssignFeeStructure(item)}
        >
          <Ionicons name="person-add-outline" size={18} color="#fff" />
          <Text style={styles.actionButtonText}>Assign</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditFeeStructure(item)}
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteFeeStructure(item.id)}
        >
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fee Management</Text>
      </View>
      
      {/* Tabs for Fee Structure and Session Fees */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'feeStructure' && styles.activeTab]}
          onPress={() => setActiveTab('feeStructure')}
        >
          <Ionicons 
            name="construct-outline" 
            size={18} 
            color={activeTab === 'feeStructure' ? '#fff' : '#333'} 
          />
          <Text style={[styles.tabText, activeTab === 'feeStructure' && styles.activeTabText]}>
            Fee Structure
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sessionFees' && styles.activeTab]}
          onPress={() => setActiveTab('sessionFees')}
        >
          <Ionicons 
            name="calendar-outline" 
            size={18} 
            color={activeTab === 'sessionFees' ? '#fff' : '#333'} 
          />
          <Text style={[styles.tabText, activeTab === 'sessionFees' && styles.activeTabText]}>
            Session Fees
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'feeStructure' ? (
        // Original fee structure content
        <View style={styles.content}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search fee structure"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddFeeStructure}
          >
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Add Fee Structure</Text>
          </TouchableOpacity>
          
          <FlatList
            data={filteredFeeStructures}
            renderItem={renderFeeStructureItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.feeList}
          />
        </View>
      ) : (
        // New session fees content
        <View style={styles.content}>
          <View style={styles.filterBar}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Academic Year:</Text>
              <View style={styles.pickerContainer}>
                {academicYears.map(year => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.yearOption,
                      selectedAcademicYear === year && styles.selectedYear
                    ]}
                    onPress={() => setSelectedAcademicYear(year)}
                  >
                    <Text style={selectedAcademicYear === year ? styles.selectedYearText : null}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Session:</Text>
              <View style={styles.pickerContainer}>
                {sessions.map(session => (
                  <TouchableOpacity
                    key={session.id}
                    style={[
                      styles.sessionOption,
                      selectedSession === session.id && styles.selectedSession
                    ]}
                    onPress={() => setSelectedSession(session.id)}
                  >
                    <Text style={selectedSession === session.id ? styles.selectedSessionText : null}>
                      {session.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search student by name or class"
              value={studentSearchQuery}
              onChangeText={setStudentSearchQuery}
            />
          </View>
          
          <FlatList
            data={filteredStudentFees}
            renderItem={({ item }) => (
              <View style={styles.studentFeeCard}>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{item.studentName}</Text>
                  <View style={styles.classTag}>
                    <Text style={styles.classTagText}>Class {item.class}-{item.section}</Text>
                  </View>
                </View>
                
                {item.sessions.map(session => {
                  if (session.sessionId === selectedSession) {
                    return (
                      <View key={session.sessionId} style={styles.sessionInfo}>
                        <View style={styles.feeDetails}>
                          <View style={styles.feeRow}>
                            <Text style={styles.feeLabel}>Total Fee:</Text>
                            <Text style={styles.feeValue}>₹{session.amount}</Text>
                          </View>
                          
                          <View style={styles.feeRow}>
                            <Text style={styles.feeLabel}>Paid:</Text>
                            <Text style={[styles.feeValue, { color: '#4cd964' }]}>₹{session.paid}</Text>
                          </View>
                          
                          <View style={styles.feeRow}>
                            <Text style={styles.feeLabel}>Balance:</Text>
                            <Text style={[styles.feeValue, { color: session.balance > 0 ? '#ff9500' : '#4cd964' }]}>
                              ₹{session.balance}
                            </Text>
                          </View>
                          
                          <View style={styles.feeRow}>
                            <Text style={styles.feeLabel}>Status:</Text>
                            <View style={[
                              styles.statusTag,
                              session.status === 'Paid' ? styles.paidStatus :
                              session.status === 'Partial' ? styles.partialStatus :
                              session.status === 'Pending' ? styles.pendingStatus :
                              styles.notDueStatus
                            ]}>
                              <Text style={styles.statusText}>{session.status}</Text>
                            </View>
                          </View>
                          
                          <View style={styles.feeRow}>
                            <Text style={styles.feeLabel}>Due Date:</Text>
                            <Text style={styles.feeValue}>{session.dueDate}</Text>
                          </View>
                        </View>
                        
                        <View style={styles.feeActions}>
                          {session.status !== 'Paid' && (
                            <TouchableOpacity
                              style={styles.payButton}
                              onPress={() => handlePayFees(item)}
                            >
                              <Ionicons name="cash-outline" size={16} color="#fff" />
                              <Text style={styles.actionButtonText}>Pay Fee</Text>
                            </TouchableOpacity>
                          )}
                          
                          <TouchableOpacity
                            style={styles.viewButton}
                            onPress={() => handleViewFeeDetails(item)}
                          >
                            <Ionicons name="eye-outline" size={16} color="#fff" />
                            <Text style={styles.actionButtonText}>View Details</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }
                  return null;
                })}
              </View>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.studentFeesList}
            ListEmptyComponent={
              <View style={styles.emptyListContainer}>
                <Ionicons name="document-outline" size={64} color="#ccc" />
                <Text style={styles.emptyListText}>No student fees found</Text>
                <Text style={styles.emptyListSubText}>
                  Try adjusting your search or filters
                </Text>
              </View>
            }
          />
        </View>
      )}
      
      {/* Fee Structure Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Edit Fee Structure' : 'Add Fee Structure'}
            </Text>

            <ScrollView>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={currentFeeStructure.name}
                  onChangeText={(text) =>
                    setCurrentFeeStructure({ ...currentFeeStructure, name: text })
                  }
                  placeholder="Enter fee structure name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Applicable For</Text>
                <TextInput
                  style={styles.input}
                  value={currentFeeStructure.class}
                  onChangeText={(text) =>
                    setCurrentFeeStructure({ ...currentFeeStructure, class: text })
                  }
                  placeholder="e.g., All Classes, Class 11-12"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tuition Fee</Text>
                <TextInput
                  style={styles.input}
                  value={currentFeeStructure.tuitionFee.toString()}
                  onChangeText={(text) => handleFeeChange('tuitionFee', text)}
                  placeholder="Enter tuition fee"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bus Fee</Text>
                <TextInput
                  style={styles.input}
                  value={currentFeeStructure.busFee.toString()}
                  onChangeText={(text) => handleFeeChange('busFee', text)}
                  placeholder="Enter bus fee"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Library Fee</Text>
                <TextInput
                  style={styles.input}
                  value={currentFeeStructure.libraryFee.toString()}
                  onChangeText={(text) => handleFeeChange('libraryFee', text)}
                  placeholder="Enter library fee"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Sports Fee</Text>
                <TextInput
                  style={styles.input}
                  value={currentFeeStructure.sportsFee.toString()}
                  onChangeText={(text) => handleFeeChange('sportsFee', text)}
                  placeholder="Enter sports fee"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Exam Fee</Text>
                <TextInput
                  style={styles.input}
                  value={currentFeeStructure.examFee.toString()}
                  onChangeText={(text) => handleFeeChange('examFee', text)}
                  placeholder="Enter exam fee"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total Fee:</Text>
                <Text style={styles.totalValue}>
                  ₹{currentFeeStructure.totalFee}
                </Text>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSaveFeeStructure}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Assign Fee Structure Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={assignModalVisible}
        onRequestClose={() => setAssignModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Assign Fee Structure</Text>
            <Text style={styles.modalSubtitle}>
              {currentFeeStructure.name} - {currentFeeStructure.class}
            </Text>

            <View style={styles.assignOptions}>
              <TouchableOpacity style={styles.assignOptionButton}>
                <Ionicons name="people-outline" size={24} color="#0066cc" />
                <Text style={styles.assignOptionText}>Assign to Class</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.assignOptionButton}>
                <Ionicons name="person-outline" size={24} color="#0066cc" />
                <Text style={styles.assignOptionText}>Assign to Student</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setAssignModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 8,
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  activeTab: {
    backgroundColor: '#3f51b5',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  filterBar: {
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
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  yearOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedYear: {
    backgroundColor: '#3f51b5',
  },
  selectedYearText: {
    color: '#fff',
  },
  sessionOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedSession: {
    backgroundColor: '#3f51b5',
  },
  selectedSessionText: {
    color: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
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
    height: 48,
    fontSize: 16,
  },
  studentFeesList: {
    paddingBottom: 16,
  },
  studentFeeCard: {
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
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  classTag: {
    backgroundColor: '#e8eaf6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  classTagText: {
    fontSize: 12,
    color: '#3f51b5',
    fontWeight: '500',
  },
  sessionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feeDetails: {
    flex: 2,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feeLabel: {
    fontSize: 14,
    color: '#666',
  },
  feeValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  paidStatus: {
    backgroundColor: '#e6f7ed',
  },
  partialStatus: {
    backgroundColor: '#fff5eb',
  },
  pendingStatus: {
    backgroundColor: '#ffebee',
  },
  notDueStatus: {
    backgroundColor: '#e8eaf6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  feeActions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4cd964',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066cc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyListText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyListSubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3f51b5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 4,
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#0066cc',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  assignOptions: {
    marginVertical: 16,
  },
  assignOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  assignOptionText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  feeCard: {
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
  feeHeader: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  feeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  feeClass: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  feeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalFeeItem: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalFeeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalFeeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  assignButton: {
    backgroundColor: '#5856d6',
  },
  editButton: {
    backgroundColor: '#0066cc',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
  },
  feeList: {
    paddingBottom: 16,
  },
});

export default FeeManagementScreen; 