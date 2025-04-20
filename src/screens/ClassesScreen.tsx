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
import Table from '../components/Table';

// Mock data for initial classes
const initialClasses = [
  {
    id: '1',
    name: 'Class 1',
    section: 'A',
    classTeacher: 'Mr. Rajesh Sharma',
    totalStudents: 35,
    roomNumber: '101',
    schedule: 'Mon-Fri, 8:00 AM - 2:00 PM',
  },
  {
    id: '2',
    name: 'Class 2',
    section: 'B',
    classTeacher: 'Mrs. Priya Verma',
    totalStudents: 28,
    roomNumber: '102',
    schedule: 'Mon-Fri, 8:00 AM - 2:00 PM',
  },
  {
    id: '3',
    name: 'Class 3',
    section: 'A',
    classTeacher: 'Mr. Anand Patel',
    totalStudents: 32,
    roomNumber: '103',
    schedule: 'Mon-Fri, 8:00 AM - 2:00 PM',
  },
  {
    id: '4',
    name: 'Class 4',
    section: 'C',
    classTeacher: 'Mrs. Sunita Gupta',
    totalStudents: 30,
    roomNumber: '104',
    schedule: 'Mon-Fri, 8:00 AM - 2:00 PM',
  },
  {
    id: '5',
    name: 'Class 5',
    section: 'B',
    classTeacher: 'Mr. Vikram Singh',
    totalStudents: 33,
    roomNumber: '105',
    schedule: 'Mon-Fri, 8:00 AM - 2:00 PM',
  },
];

// Available sections for filtering
const availableSections = ['All', 'A', 'B', 'C', 'D', 'E'];

const ClassesScreen = ({ navigation }: any) => {
  const [classes, setClasses] = useState(initialClasses);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentClass, setCurrentClass] = useState({
    id: '',
    name: '',
    section: '',
    classTeacher: '',
    totalStudents: '',
    roomNumber: '',
    schedule: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [classesPerPage, setClassesPerPage] = useState(10);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to load data from API (using mock data for now)
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, this would fetch from an API
      // Simulating API call with a timeout
      setTimeout(() => {
        setClasses(initialClasses);
        setIsLoading(false);
        setRefreshing(false);
      }, 1000);
    } catch (err) {
      setError('An error occurred while fetching classes data');
      console.error(err);
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Refresh data
  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Filter classes based on search and section
  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch = 
      classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.classTeacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSection = selectedSection === 'All' || classItem.section === selectedSection;
    
    return matchesSearch && matchesSection;
  });

  // Calculate pagination
  const indexOfLastClass = currentPage * classesPerPage;
  const indexOfFirstClass = indexOfLastClass - classesPerPage;
  const currentClasses = filteredClasses.slice(indexOfFirstClass, indexOfLastClass);
  const totalPages = Math.ceil(filteredClasses.length / classesPerPage);

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

  // Open modal for adding a new class
  const handleAddClass = () => {
    setCurrentClass({
      id: '',
      name: '',
      section: '',
      classTeacher: '',
      totalStudents: '',
      roomNumber: '',
      schedule: '',
    });
    setIsEditing(false);
    setModalVisible(true);
  };

  // Open modal for editing a class
  const handleEditClass = (classItem) => {
    setCurrentClass({
      ...classItem,
      totalStudents: classItem.totalStudents.toString(),
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  // Delete a class
  const handleDeleteClass = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this class?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setClasses(classes.filter((classItem) => classItem.id !== id));
            // In a real app, this would make an API call to delete the class
          }
        }
      ]
    );
  };

  // Save class (add or update)
  const handleSaveClass = () => {
    // Validation
    if (!currentClass.name || !currentClass.section || !currentClass.classTeacher) {
      Alert.alert('Missing Information', 'Please fill in all required fields (name, section, and class teacher).');
      return;
    }

    // Convert totalStudents to number
    const formattedClass = {
      ...currentClass,
      totalStudents: parseInt(currentClass.totalStudents) || 0,
    };

    if (isEditing) {
      // Update existing class
      setClasses(
        classes.map((classItem) =>
          classItem.id === currentClass.id ? formattedClass : classItem
        )
      );
      // In a real app, this would make an API call to update the class
    } else {
      // Add new class
      const newClass = {
        ...formattedClass,
        id: Date.now().toString(),
      };
      setClasses([...classes, newClass]);
      // In a real app, this would make an API call to add the class
    }
    setModalVisible(false);
  };

  // View class details
  const handleViewClassDetails = (classItem) => {
    Alert.alert(
      'Class Details',
      `Name: ${classItem.name}-${classItem.section}\nTeacher: ${classItem.classTeacher}\nTotal Students: ${classItem.totalStudents}\nRoom: ${classItem.roomNumber}\nSchedule: ${classItem.schedule}`,
      [{ text: 'OK' }]
    );
  };

  // View class students
  const handleViewStudents = (classItem) => {
    // In a real app, this would navigate to a student list filtered by class
    Alert.alert('View Students', `Viewing students for ${classItem.name}-${classItem.section}`);
  };

  // Render loading state
  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading classes...</Text>
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
          Showing {indexOfFirstClass + 1}-{Math.min(indexOfLastClass, filteredClasses.length)} of {filteredClasses.length} classes
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
      key: 'name',
      title: 'Class',
      width: 80,
      render: (item) => (
        <Text style={styles.cellText}>{item.name}</Text>
      ),
    },
    {
      key: 'section',
      title: 'Section',
      width: 80,
    },
    {
      key: 'classTeacher',
      title: 'Class Teacher',
      width: 150,
    },
    {
      key: 'totalStudents',
      title: 'Students',
      width: 80,
    },
    {
      key: 'roomNumber',
      title: 'Room',
      width: 80,
    },
    {
      key: 'schedule',
      title: 'Schedule',
      width: 200,
    },
  ];

  // Define table actions
  const tableActions = [
    {
      icon: 'eye-outline',
      color: '#0066cc',
      onPress: handleViewClassDetails,
    },
    {
      icon: 'people-outline',
      color: '#34c759',
      onPress: handleViewStudents,
    },
    {
      icon: 'create-outline',
      color: '#5856d6',
      onPress: handleEditClass,
    },
    {
      icon: 'trash-outline',
      color: '#ff3b30',
      onPress: (classItem) => handleDeleteClass(classItem.id),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Class Management</Text>
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
            onPress={handleAddClass}
          >
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Add Class</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.searchFilterContainer}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by class name, teacher, or room..."
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
        
        {/* Section Filter */}
        <View style={styles.filterContainer}>
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
          data={currentClasses}
          columns={tableColumns}
          actions={tableActions}
          keyExtractor={(item) => item.id}
          onRowPress={handleViewClassDetails}
          emptyState={
            <View style={styles.emptyContainer}>
              <Ionicons name="school-outline" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>No Classes Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery || selectedSection !== 'All'
                  ? 'Try adjusting your search or filters'
                  : 'Add a new class to get started'}
              </Text>
              <TouchableOpacity
                style={styles.emptyAddButton}
                onPress={handleAddClass}
              >
                <Ionicons name="add" size={16} color="#fff" />
                <Text style={styles.emptyAddButtonText}>Add Class</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
      
      {filteredClasses.length > 0 && renderPagination()}
      
      {/* Add/Edit Class Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Edit Class' : 'Add New Class'}
            </Text>
            
            <ScrollView>
              <View style={styles.formRow}>
                <View style={[styles.formControl, { width: '48%' }]}>
                  <Text style={styles.inputLabel}>Class Name*</Text>
                  <TextInput
                    style={styles.input}
                    value={currentClass.name}
                    onChangeText={(text) =>
                      setCurrentClass({ ...currentClass, name: text })
                    }
                    placeholder="Enter class name"
                  />
                </View>
                
                <View style={[styles.formControl, { width: '48%' }]}>
                  <Text style={styles.inputLabel}>Section*</Text>
                  <TextInput
                    style={styles.input}
                    value={currentClass.section}
                    onChangeText={(text) =>
                      setCurrentClass({ ...currentClass, section: text })
                    }
                    placeholder="Enter section"
                  />
                </View>
              </View>
              
              <View style={styles.formRow}>
                <View style={styles.formControl}>
                  <Text style={styles.inputLabel}>Class Teacher*</Text>
                  <TextInput
                    style={styles.input}
                    value={currentClass.classTeacher}
                    onChangeText={(text) =>
                      setCurrentClass({ ...currentClass, classTeacher: text })
                    }
                    placeholder="Enter class teacher name"
                  />
                </View>
              </View>
              
              <View style={styles.formRow}>
                <View style={[styles.formControl, { width: '48%' }]}>
                  <Text style={styles.inputLabel}>Total Students</Text>
                  <TextInput
                    style={styles.input}
                    value={currentClass.totalStudents.toString()}
                    onChangeText={(text) =>
                      setCurrentClass({ ...currentClass, totalStudents: text })
                    }
                    placeholder="Enter total students"
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={[styles.formControl, { width: '48%' }]}>
                  <Text style={styles.inputLabel}>Room Number</Text>
                  <TextInput
                    style={styles.input}
                    value={currentClass.roomNumber}
                    onChangeText={(text) =>
                      setCurrentClass({ ...currentClass, roomNumber: text })
                    }
                    placeholder="Enter room number"
                  />
                </View>
              </View>
              
              <View style={styles.formRow}>
                <View style={styles.formControl}>
                  <Text style={styles.inputLabel}>Schedule</Text>
                  <TextInput
                    style={styles.input}
                    value={currentClass.schedule}
                    onChangeText={(text) =>
                      setCurrentClass({ ...currentClass, schedule: text })
                    }
                    placeholder="Enter class schedule"
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
                  onPress={handleSaveClass}
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
  paginationButtonText: {
    fontSize: 14,
    color: '#333',
  },
  activePaginationButtonText: {
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3f51b5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3f51b5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  emptyAddButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  formControl: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 16,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#3f51b5',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  cellText: {
    fontSize: 14,
    color: '#333',
  },
});

export default ClassesScreen; 