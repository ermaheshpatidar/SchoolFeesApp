import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchStudents } from '../services/api';
import Table from '../components/Table';

// Initially empty until API response is received
const initialStudents = [];

// Available classes and sections for filtering
const availableClasses = ['All', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const availableSections = ['All', 'A', 'B', 'C', 'D', 'E'];

const StudentManagementScreen = ({ navigation }: any) => {
  const [students, setStudents] = useState(initialStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({
    id: '',
    name: '',
    rollNumber: '',
    class: '',
    section: '',
    parentName: '',
    contactNumber: '',
    admissionNumber: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(50);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Function to load data from API
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetchStudents();
      
      if (response && response.success) {
        setStudents(response.data || []);
      } else {
        setError('Failed to load students data');
      }
    } catch (err) {
      setError('An error occurred while fetching students');
      console.error(err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh data
  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Filter students based on search, class, and section
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.includes(searchQuery) ||
      student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.contactNumber.includes(searchQuery);
    
    const matchesClass = selectedClass === 'All' || student.class === selectedClass;
    const matchesSection = selectedSection === 'All' || student.section === selectedSection;
    
    return matchesSearch && matchesClass && matchesSection;
  });

  // Calculate pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Pagination controls
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Open modal for adding a new student
  const handleAddStudent = () => {
    setCurrentStudent({
      id: '',
      name: '',
      rollNumber: '',
      class: '',
      section: '',
      parentName: '',
      contactNumber: '',
      admissionNumber: '',
    });
    setIsEditing(false);
    setModalVisible(true);
  };

  // Open modal for editing a student
  const handleEditStudent = (student) => {
    setCurrentStudent(student);
    setIsEditing(true);
    setModalVisible(true);
  };

  // Delete a student
  const handleDeleteStudent = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this student?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setStudents(students.filter((student) => student.id !== id));
            // In a real app, this would make an API call to delete the student
          }
        }
      ]
    );
  };

  // Save student (add or update)
  const handleSaveStudent = () => {
    // Validation
    if (!currentStudent.name || !currentStudent.rollNumber || !currentStudent.class || !currentStudent.section) {
      Alert.alert('Missing Information', 'Please fill in all required fields (name, roll number, class, and section).');
      return;
    }

    if (isEditing) {
      // Update existing student
      setStudents(
        students.map((student) =>
          student.id === currentStudent.id ? currentStudent : student
        )
      );
      // In a real app, this would make an API call to update the student
    } else {
      // Add new student
      const newStudent = {
        ...currentStudent,
        id: Date.now().toString(),
      };
      setStudents([...students, newStudent]);
      // In a real app, this would make an API call to add the student
    }
    setModalVisible(false);
  };

  // WhatsApp integration
  const handleWhatsAppMessage = (contactNumber) => {
    // In a real app, this would integrate with the WhatsApp API
    Alert.alert('WhatsApp Integration', `Sending WhatsApp message to ${contactNumber}`);
  };

  // View student details
  const handleViewStudentDetails = (student) => {
    // In a real app, this would navigate to a detailed view
    Alert.alert('Student Details', `Viewing details for ${student.name}`);
  };

  // Manage fees for a student
  const handleManageFees = (student) => {
    // Navigate to fee management for this student
    // In a real app this would navigate to a fee management screen with the student's data
    Alert.alert('Fee Management', `Managing fees for ${student.name}`);
  };

  // Render loading state
  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading students...</Text>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#ff3b30" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render pagination
  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <View style={styles.paginationContainer}>
        <Text style={styles.paginationInfo}>
          Showing {indexOfFirstStudent + 1}-{Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} students
        </Text>
        
        <View style={styles.paginationControls}>
          <TouchableOpacity
            style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
            onPress={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <Ionicons name="chevron-back" size={16} color={currentPage === 1 ? '#ccc' : '#0066cc'} />
          </TouchableOpacity>
          
          {pageNumbers.map(number => (
            <TouchableOpacity
              key={number}
              style={[
                styles.paginationButton,
                number === currentPage && styles.activePaginationButton,
              ]}
              onPress={() => goToPage(number)}
            >
              <Text style={[
                styles.paginationButtonText,
                number === currentPage && styles.activePaginationButtonText,
              ]}>
                {number}
              </Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity
            style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
            onPress={goToNextPage}
            disabled={currentPage === totalPages}
          >
            <Ionicons name="chevron-forward" size={16} color={currentPage === totalPages ? '#ccc' : '#0066cc'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Define table columns
  const tableColumns = [
    {
      key: 'rollNumber',
      title: 'Roll No',
      width: 70,
    },
    {
      key: 'name',
      title: 'Student Name',
      width: 150,
    },
    {
      key: 'class',
      title: 'Class',
      width: 50,
      render: (item) => (
        <Text style={styles.cellText}>{item.class}-{item.section}</Text>
      ),
    },
    {
      key: 'parentName',
      title: 'Parent Name',
      width: 150,
    },
    {
      key: 'contactNumber',
      title: 'Contact',
      width: 120,
    },
    {
      key: 'admissionNumber',
      title: 'Admission No',
      width: 120,
    },
  ];

  // Define table actions
  const tableActions = [
    {
      icon: 'eye-outline',
      color: '#0066cc',
      onPress: handleViewStudentDetails,
    },
    {
      icon: 'create-outline',
      color: '#5856d6',
      onPress: handleEditStudent,
    },
    {
      icon: 'cash-outline',
      color: '#4cd964',
      onPress: handleManageFees,
    },
    {
      icon: 'trash-outline',
      color: '#ff3b30',
      onPress: (student) => handleDeleteStudent(student.id),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Student Management</Text>
        {/* Add and refresh buttons */}
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <Ionicons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddStudent}
          >
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Add Student</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.searchFilterContainer}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, roll number, or parent..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        {/* Filters */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Class:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterOptions}
          >
            {availableClasses.map((classOption) => (
              <TouchableOpacity
                key={classOption}
                style={[
                  styles.filterOption,
                  selectedClass === classOption && styles.selectedFilterOption,
                ]}
                onPress={() => setSelectedClass(classOption)}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    selectedClass === classOption && styles.selectedFilterOptionText,
                  ]}
                >
                  {classOption}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <Text style={styles.filterLabel}>Section:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterOptions}
          >
            {availableSections.map((sectionOption) => (
              <TouchableOpacity
                key={sectionOption}
                style={[
                  styles.filterOption,
                  selectedSection === sectionOption && styles.selectedFilterOption,
                ]}
                onPress={() => setSelectedSection(sectionOption)}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    selectedSection === sectionOption && styles.selectedFilterOptionText,
                  ]}
                >
                  {sectionOption}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      
      <View style={styles.tableContainer}>
        <Table
          data={currentStudents}
          columns={tableColumns}
          actions={tableActions}
          keyExtractor={(item) => item.id}
          onRowPress={handleViewStudentDetails}
          emptyState={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>No Students Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery || selectedClass !== 'All' || selectedSection !== 'All'
                  ? 'Try adjusting your search or filters'
                  : 'Add a new student to get started'}
              </Text>
              <TouchableOpacity
                style={styles.emptyAddButton}
                onPress={handleAddStudent}
              >
                <Ionicons name="add" size={16} color="#fff" />
                <Text style={styles.emptyAddButtonText}>Add Student</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
      
      {filteredStudents.length > 0 && renderPagination()}
      
      {/* Add/Edit Student Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Edit Student' : 'Add New Student'}
            </Text>
            
            <ScrollView>
              <View style={styles.formRow}>
                <View style={styles.formControl}>
                  <Text style={styles.inputLabel}>Name*</Text>
                  <TextInput
                    style={styles.input}
                    value={currentStudent.name}
                    onChangeText={(text) =>
                      setCurrentStudent({ ...currentStudent, name: text })
                    }
                    placeholder="Enter student name"
                  />
                </View>
              </View>
              
              <View style={styles.formRow}>
                <View style={styles.formControl}>
                  <Text style={styles.inputLabel}>Roll Number*</Text>
                  <TextInput
                    style={styles.input}
                    value={currentStudent.rollNumber}
                    onChangeText={(text) =>
                      setCurrentStudent({ ...currentStudent, rollNumber: text })
                    }
                    placeholder="Enter roll number"
                  />
                </View>
              </View>
              
              <View style={styles.formRow}>
                <View style={[styles.formControl, { width: '48%' }]}>
                  <Text style={styles.inputLabel}>Class*</Text>
                  <TextInput
                    style={styles.input}
                    value={currentStudent.class}
                    onChangeText={(text) =>
                      setCurrentStudent({ ...currentStudent, class: text })
                    }
                    placeholder="Enter class"
                  />
                </View>
                
                <View style={[styles.formControl, { width: '48%' }]}>
                  <Text style={styles.inputLabel}>Section*</Text>
                  <TextInput
                    style={styles.input}
                    value={currentStudent.section}
                    onChangeText={(text) =>
                      setCurrentStudent({ ...currentStudent, section: text })
                    }
                    placeholder="Enter section"
                  />
                </View>
              </View>
              
              <View style={styles.formRow}>
                <View style={styles.formControl}>
                  <Text style={styles.inputLabel}>Parent Name</Text>
                  <TextInput
                    style={styles.input}
                    value={currentStudent.parentName}
                    onChangeText={(text) =>
                      setCurrentStudent({ ...currentStudent, parentName: text })
                    }
                    placeholder="Enter parent name"
                  />
                </View>
              </View>
              
              <View style={styles.formRow}>
                <View style={styles.formControl}>
                  <Text style={styles.inputLabel}>Contact Number</Text>
                  <TextInput
                    style={styles.input}
                    value={currentStudent.contactNumber}
                    onChangeText={(text) =>
                      setCurrentStudent({ ...currentStudent, contactNumber: text })
                    }
                    placeholder="Enter contact number"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
              
              <View style={styles.formRow}>
                <View style={styles.formControl}>
                  <Text style={styles.inputLabel}>Admission Number</Text>
                  <TextInput
                    style={styles.input}
                    value={currentStudent.admissionNumber}
                    onChangeText={(text) =>
                      setCurrentStudent({ ...currentStudent, admissionNumber: text })
                    }
                    placeholder="Enter admission number"
                  />
                </View>
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
                  onPress={handleSaveStudent}
                >
                  <Text style={styles.saveButtonText}>
                    {isEditing ? 'Update' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    marginRight: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  searchFilterContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  filterContainer: {
    marginTop: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#555',
  },
  filterOptions: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  filterOption: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  selectedFilterOption: {
    backgroundColor: '#3f51b5',
  },
  filterOptionText: {
    color: '#333',
  },
  selectedFilterOptionText: {
    color: '#fff',
  },
  tableContainer: {
    flex: 1,
    padding: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  paginationInfo: {
    fontSize: 14,
    color: '#666',
  },
  paginationControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationButton: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  activePaginationButton: {
    backgroundColor: '#3f51b5',
  },
  disabledButton: {
    backgroundColor: '#f5f5f5',
    opacity: 0.5,
  },
  paginationButtonText: {
    color: '#333',
  },
  activePaginationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  formControl: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#0066cc',
  },
  cancelButtonText: {
    color: '#333',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066cc',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  emptyAddButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cellText: {
    fontSize: 14,
    color: '#333',
  },
});

export default StudentManagementScreen; 