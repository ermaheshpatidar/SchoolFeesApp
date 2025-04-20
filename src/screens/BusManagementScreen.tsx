import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for buses
const mockBuses = [
  {
    id: '1',
    busNumber: 'BUS001',
    route: 'North Route',
    driverName: 'Ramesh Yadav',
    driverContact: '9876543210',
    capacity: 40,
    assignedStudents: 32,
    monthlyfee: 2000,
  },
  {
    id: '2',
    busNumber: 'BUS002',
    route: 'South Route',
    driverName: 'Pushpendra Kumar',
    driverContact: '9876543211',
    capacity: 35,
    assignedStudents: 28,
    monthlyfee: 1800,
  },
  {
    id: '3',
    busNumber: 'BUS003',
    route: 'East Route',
    driverName: 'Sunil Verma',
    driverContact: '9876543212',
    capacity: 40,
    assignedStudents: 37,
    monthlyfee: 2200,
  },
];

// Mock data for students that can be assigned to buses
const mockStudents = [
  { id: '1', name: 'Amit Sharma', class: '10', section: 'A', assigned: true },
  { id: '2', name: 'Priya Patel', class: '10', section: 'B', assigned: true },
  { id: '3', name: 'Rahul Verma', class: '9', section: 'A', assigned: false },
  { id: '4', name: 'Sneha Gupta', class: '11', section: 'A', assigned: false },
  { id: '5', name: 'Vijay Singh', class: '12', section: 'B', assigned: true },
  { id: '6', name: 'Neha Mishra', class: '8', section: 'C', assigned: false },
];

const BusManagementScreen = ({ navigation }) => {
  const [buses, setBuses] = useState(mockBuses);
  const [modalVisible, setModalVisible] = useState(false);
  const [studentsModalVisible, setStudentsModalVisible] = useState(false);
  const [currentBus, setCurrentBus] = useState({
    id: '',
    busNumber: '',
    route: '',
    driverName: '',
    driverContact: '',
    capacity: 0,
    assignedStudents: 0,
    monthlyfee: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState(mockStudents);
  const [selectedBusId, setSelectedBusId] = useState('');

  // Filter buses based on search
  const filteredBuses = buses.filter((bus) => {
    return bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.driverName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Open modal for adding a new bus
  const handleAddBus = () => {
    setCurrentBus({
      id: '',
      busNumber: '',
      route: '',
      driverName: '',
      driverContact: '',
      capacity: 0,
      assignedStudents: 0,
      monthlyfee: 0,
    });
    setIsEditing(false);
    setModalVisible(true);
  };

  // Open modal for editing a bus
  const handleEditBus = (bus) => {
    setCurrentBus(bus);
    setIsEditing(true);
    setModalVisible(true);
  };

  // Delete a bus
  const handleDeleteBus = (id) => {
    setBuses(buses.filter((bus) => bus.id !== id));
  };

  // Save bus (add or update)
  const handleSaveBus = () => {
    if (isEditing) {
      // Update existing bus
      setBuses(
        buses.map((bus) =>
          bus.id === currentBus.id ? currentBus : bus
        )
      );
    } else {
      // Add new bus
      const newBus = {
        ...currentBus,
        id: Date.now().toString(),
        assignedStudents: 0,
      };
      setBuses([...buses, newBus]);
    }
    setModalVisible(false);
  };

  // Open modal to manage students
  const handleManageStudents = (bus) => {
    setSelectedBusId(bus.id);
    setStudentsModalVisible(true);
  };

  // Toggle student assignment to bus
  const toggleStudentAssignment = (studentId) => {
    setStudents(
      students.map((student) =>
        student.id === studentId
          ? { ...student, assigned: !student.assigned }
          : student
      )
    );

    // In a real app, we would also update the bus's assignedStudents count
    // This is just a mock implementation
    const assignedCount = students.filter(
      (student) => student.id === studentId
        ? !student.assigned
        : student.assigned
    ).length;

    setBuses(
      buses.map((bus) =>
        bus.id === selectedBusId
          ? { ...bus, assignedStudents: assignedCount }
          : bus
      )
    );
  };

  // Render bus item
  const renderBusItem = ({ item }) => (
    <View style={styles.busCard}>
      <View style={styles.busHeader}>
        <View>
          <Text style={styles.busNumber}>{item.busNumber}</Text>
          <Text style={styles.busRoute}>{item.route}</Text>
        </View>
        <View style={styles.capacityContainer}>
          <Text style={styles.capacityText}>
            {item.assignedStudents}/{item.capacity}
          </Text>
          <Text style={styles.capacityLabel}>students</Text>
        </View>
      </View>
      
      <View style={styles.busDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="person-outline" size={16} color="#666" />
          <Text style={styles.detailLabel}>Driver: </Text>
          <Text style={styles.detailValue}>{item.driverName}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="call-outline" size={16} color="#666" />
          <Text style={styles.detailLabel}>Contact: </Text>
          <Text style={styles.detailValue}>{item.driverContact}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="cash-outline" size={16} color="#666" />
          <Text style={styles.detailLabel}>Monthly Fee: </Text>
          <Text style={styles.detailValue}>₹{item.monthlyfee}</Text>
        </View>
      </View>
      
      <View style={styles.busActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.studentsButton]}
          onPress={() => handleManageStudents(item)}
        >
          <Ionicons name="people-outline" size={18} color="#fff" />
          <Text style={styles.actionButtonText}>Manage Students</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditBus(item)}
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteBus(item.id)}
        >
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render student item
  const renderStudentItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.studentItem,
        item.assigned ? styles.studentItemAssigned : null,
      ]}
      onPress={() => toggleStudentAssignment(item.id)}
    >
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentClass}>
          Class {item.class}-{item.section}
        </Text>
      </View>
      <View style={styles.studentStatus}>
        {item.assigned ? (
          <Ionicons name="checkmark-circle" size={24} color="#4cd964" />
        ) : (
          <Ionicons name="add-circle-outline" size={24} color="#0066cc" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search buses by number, route, or driver"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredBuses}
        keyExtractor={(item) => item.id}
        renderItem={renderBusItem}
        contentContainerStyle={styles.busesList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="bus-outline" size={48} color="#999" />
            <Text style={styles.emptyText}>No buses found</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddBus}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Add/Edit Bus Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Edit Bus' : 'Add Bus'}
            </Text>

            <ScrollView>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bus Number</Text>
                <TextInput
                  style={styles.input}
                  value={currentBus.busNumber}
                  onChangeText={(text) =>
                    setCurrentBus({ ...currentBus, busNumber: text })
                  }
                  placeholder="Enter bus number"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Route</Text>
                <TextInput
                  style={styles.input}
                  value={currentBus.route}
                  onChangeText={(text) =>
                    setCurrentBus({ ...currentBus, route: text })
                  }
                  placeholder="Enter route description"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Driver Name</Text>
                <TextInput
                  style={styles.input}
                  value={currentBus.driverName}
                  onChangeText={(text) =>
                    setCurrentBus({ ...currentBus, driverName: text })
                  }
                  placeholder="Enter driver name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Driver Contact</Text>
                <TextInput
                  style={styles.input}
                  value={currentBus.driverContact}
                  onChangeText={(text) =>
                    setCurrentBus({ ...currentBus, driverContact: text })
                  }
                  placeholder="Enter driver contact number"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Capacity</Text>
                  <TextInput
                    style={styles.input}
                    value={currentBus.capacity.toString()}
                    onChangeText={(text) =>
                      setCurrentBus({ ...currentBus, capacity: parseInt(text) || 0 })
                    }
                    placeholder="Enter capacity"
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Monthly Fee</Text>
                  <TextInput
                    style={styles.input}
                    value={currentBus.monthlyfee.toString()}
                    onChangeText={(text) =>
                      setCurrentBus({ ...currentBus, monthlyfee: parseInt(text) || 0 })
                    }
                    placeholder="Enter fee"
                    keyboardType="numeric"
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
                  onPress={handleSaveBus}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Manage Students Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={studentsModalVisible}
        onRequestClose={() => setStudentsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Manage Students</Text>
              <TouchableOpacity onPress={() => setStudentsModalVisible(false)}>
                <Ionicons name="close-outline" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Assign or remove students from this bus
            </Text>
            
            <View style={styles.studentSearch}>
              <Ionicons name="search-outline" size={20} color="#666" />
              <TextInput
                style={styles.studentSearchInput}
                placeholder="Search students"
              />
            </View>
            
            <FlatList
              data={students}
              keyExtractor={(item) => item.id}
              renderItem={renderStudentItem}
              style={styles.studentsList}
              ListEmptyComponent={
                <Text style={styles.noStudentsText}>No students found</Text>
              }
            />
            
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setStudentsModalVisible(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  busesList: {
    padding: 16,
  },
  busCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  busNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  busRoute: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  capacityContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  capacityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  capacityLabel: {
    fontSize: 12,
    color: '#666',
  },
  busDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  busActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    justifyContent: 'center',
  },
  studentsButton: {
    backgroundColor: '#5856d6',
    flex: 2,
    marginRight: 8,
  },
  editButton: {
    backgroundColor: '#0066cc',
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    flex: 1,
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
  row: {
    flexDirection: 'row',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
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
  studentSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  studentSearchInput: {
    flex: 1,
    paddingVertical: 10,
    marginLeft: 8,
    fontSize: 16,
  },
  studentsList: {
    maxHeight: 400,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  studentItemAssigned: {
    backgroundColor: '#f0f8ff',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  studentClass: {
    fontSize: 14,
    color: '#666',
  },
  studentStatus: {
    marginLeft: 12,
  },
  noStudentsText: {
    textAlign: 'center',
    padding: 24,
    color: '#999',
  },
  doneButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default BusManagementScreen;