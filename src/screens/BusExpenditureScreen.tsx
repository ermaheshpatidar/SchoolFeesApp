import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { fetchBusExpenses } from '../services/api';

// Mock data for testing
const initialExpenses = [
  { id: '1', vehicleId: '1', date: '2023-04-15', category: 'Fuel', amount: 5000, notes: 'Monthly fuel' },
  { id: '2', vehicleId: '2', date: '2023-04-10', category: 'Maintenance', amount: 2500, notes: 'Oil change' },
  { id: '3', vehicleId: '1', date: '2023-04-05', category: 'Repair', amount: 8000, notes: 'Brake repair' },
];

const initialVehicles = [
  { id: '1', regNumber: 'KA 01 AB 1234', model: 'Ashok Leyland', capacity: 45, driver: 'Rajesh Kumar' },
  { id: '2', regNumber: 'KA 01 CD 5678', model: 'Tata', capacity: 35, driver: 'Suresh Patel' },
];

const BusExpenditureScreen = () => {
  const [activeTab, setActiveTab] = useState('expenses');
  const [expenses, setExpenses] = useState(initialExpenses);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [newExpense, setNewExpense] = useState({
    vehicleId: '',
    date: '',
    category: '',
    amount: '',
    notes: '',
  });
  const [newVehicle, setNewVehicle] = useState({
    regNumber: '',
    model: '',
    capacity: '',
    driver: '',
  });
  const [isEditingExpense, setIsEditingExpense] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] = useState(null);
  const [isEditingVehicle, setIsEditingVehicle] = useState(false);
  const [currentVehicleId, setCurrentVehicleId] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

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
      
      const response = await fetchBusExpenses();
      
      if (response.success) {
        // Map API response to match the expected structure
        const formattedVehicles = response.vehicles?.map(vehicle => ({
          id: vehicle.id,
          regNumber: vehicle.regNumber,
          model: vehicle.name || 'Unknown Model', // Use name as model or provide default
          capacity: parseInt(vehicle.capacity) || 0, // Convert string to number
          driver: vehicle.driver
        })) || [];
        
        // Map expenses to match the expected structure
        const formattedExpenses = response.expenses?.map(expense => ({
          id: expense.id,
          vehicleId: expense.vehicleId,
          date: expense.date,
          category:'Other', // Provide default category
          amount: expense.amount,
          notes: expense.description || '' // Use description as notes
        })) || [];
        
        setExpenses(formattedExpenses);
        setVehicles(formattedVehicles);
      } else {
        setError('Failed to load data');
      }
    } catch (err) {
      setError('An error occurred while fetching data');
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

  // Expenses functions
  const addExpense = () => {
    if (!newExpense.vehicleId || !newExpense.date || !newExpense.category || !newExpense.amount) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    const expense = {
      id: Date.now().toString(),
      ...newExpense,
      amount: parseFloat(newExpense.amount),
    };

    setExpenses([expense, ...expenses]);
    resetExpenseForm();
  };

  const updateExpense = () => {
    if (!newExpense.vehicleId || !newExpense.date || !newExpense.category || !newExpense.amount) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    const updatedExpenses = expenses.map(expense => 
      expense.id === currentExpenseId 
        ? { ...expense, ...newExpense, amount: parseFloat(newExpense.amount) } 
        : expense
    );

    setExpenses(updatedExpenses);
    resetExpenseForm();
    setIsEditingExpense(false);
    setCurrentExpenseId(null);
  };

  const editExpense = (id) => {
    const expense = expenses.find(exp => exp.id === id);
    if (expense) {
      setNewExpense({
        vehicleId: expense.vehicleId,
        date: expense.date,
        category: expense.category,
        amount: expense.amount.toString(),
        notes: expense.notes,
      });
      setIsEditingExpense(true);
      setCurrentExpenseId(id);
    }
  };

  const deleteExpense = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setExpenses(expenses.filter(expense => expense.id !== id));
          }
        },
      ]
    );
  };

  const resetExpenseForm = () => {
    setNewExpense({
      vehicleId: '',
      date: '',
      category: '',
      amount: '',
      notes: '',
    });
  };

  // Vehicles functions
  const addVehicle = () => {
    if (!newVehicle.regNumber || !newVehicle.model || !newVehicle.capacity || !newVehicle.driver) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    const vehicle = {
      id: Date.now().toString(),
      ...newVehicle,
      capacity: parseInt(newVehicle.capacity),
    };

    setVehicles([...vehicles, vehicle]);
    resetVehicleForm();
  };

  const updateVehicle = () => {
    if (!newVehicle.regNumber || !newVehicle.model || !newVehicle.capacity || !newVehicle.driver) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    const updatedVehicles = vehicles.map(vehicle => 
      vehicle.id === currentVehicleId 
        ? { ...vehicle, ...newVehicle, capacity: parseInt(newVehicle.capacity) } 
        : vehicle
    );

    setVehicles(updatedVehicles);
    resetVehicleForm();
    setIsEditingVehicle(false);
    setCurrentVehicleId(null);
  };

  const editVehicle = (id) => {
    const vehicle = vehicles.find(v => v.id === id);
    if (vehicle) {
      setNewVehicle({
        regNumber: vehicle.regNumber,
        model: vehicle.model,
        capacity: vehicle.capacity.toString(),
        driver: vehicle.driver,
      });
      setIsEditingVehicle(true);
      setCurrentVehicleId(id);
    }
  };

  const deleteVehicle = (id) => {
    // Check if the vehicle has associated expenses
    const hasExpenses = expenses.some(expense => expense.vehicleId === id);
    
    if (hasExpenses) {
      Alert.alert(
        'Cannot Delete',
        'This vehicle has associated expenses. Remove the expenses first.'
      );
      return;
    }

    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this vehicle?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
          }
        },
      ]
    );
  };

  const resetVehicleForm = () => {
    setNewVehicle({
      regNumber: '',
      model: '',
      capacity: '',
      driver: '',
    });
  };

  // Filter expenses by vehicle
  const filteredExpenses = selectedVehicleId 
    ? expenses.filter(expense => expense.vehicleId === selectedVehicleId)
    : expenses;

  // Get vehicle name by ID
  const getVehicleName = (id) => {
    const vehicle = vehicles.find(v => v.id === id);
    return vehicle ? vehicle.regNumber : 'Unknown';
  };

  // Render expense item as a grid row
  const renderExpenseItem = ({ item }) => (
    <View style={styles.gridItem}>
      <View style={styles.gridRow}>
        <Text style={styles.gridCell}>{getVehicleName(item.vehicleId)}</Text>
        <Text style={styles.gridCell}>{item.date}</Text>
        <Text style={styles.gridCell}>{item.category}</Text>
        <Text style={[styles.gridCell, styles.amountCell]}>₹{item.amount}</Text>
        <View style={styles.actionsCell}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]} 
            onPress={() => editExpense(item.id)}
          >
            <Ionicons name="create-outline" size={16} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]} 
            onPress={() => deleteExpense(item.id)}
          >
            <Ionicons name="trash-outline" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Render vehicle item as a grid row
  const renderVehicleItem = ({ item }) => (
    <View style={styles.gridItem}>
      <View style={styles.gridRow}>
        <Text style={styles.gridCell}>{item.regNumber}</Text>
        <Text style={styles.gridCell}>{item.model}</Text>
        <Text style={styles.gridCell}>{item.capacity}</Text>
        <Text style={styles.gridCell}>{item.driver}</Text>
        <View style={styles.actionsCell}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]} 
            onPress={() => editVehicle(item.id)}
          >
            <Ionicons name="create-outline" size={16} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]} 
            onPress={() => deleteVehicle(item.id)}
          >
            <Ionicons name="trash-outline" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Render expenses tab content
  const renderExpensesTab = () => (
    <View style={styles.tabContent}>
      {/* Filter section */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Vehicle:</Text>
        <View style={styles.filterOptions}>
          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedVehicleId === '' && styles.filterOptionSelected,
            ]}
            onPress={() => setSelectedVehicleId('')}
          >
            <Text 
              style={[
                styles.filterOptionText,
                selectedVehicleId === '' && styles.filterOptionTextSelected,
              ]}
            >
              All Vehicles
            </Text>
          </TouchableOpacity>
          {vehicles.map(vehicle => (
            <TouchableOpacity
              key={vehicle.id}
              style={[
                styles.filterOption,
                selectedVehicleId === vehicle.id && styles.filterOptionSelected,
              ]}
              onPress={() => setSelectedVehicleId(vehicle.id)}
            >
              <Text 
                style={[
                  styles.filterOptionText,
                  selectedVehicleId === vehicle.id && styles.filterOptionTextSelected,
                ]}
              >
                {vehicle.regNumber}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Grid header */}
      <View style={styles.gridHeader}>
        <Text style={styles.gridHeaderCell}>Vehicle</Text>
        <Text style={styles.gridHeaderCell}>Date</Text>
        <Text style={styles.gridHeaderCell}>Category</Text>
        <Text style={styles.gridHeaderCell}>Amount</Text>
        <Text style={styles.gridHeaderCell}>Actions</Text>
      </View>

      {/* Expenses List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3f51b5" />
          <Text style={styles.loadingText}>Loading expenses...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#f44336" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredExpenses}
          keyExtractor={(item) => item.id}
          renderItem={renderExpenseItem}
          style={styles.gridList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {selectedVehicleId 
                ? 'No expenses found for selected vehicle' 
                : 'No expenses found'}
            </Text>
          }
        />
      )}

      {/* Form for adding/editing expense */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>
          {isEditingExpense ? 'Edit Expense' : 'Add New Expense'}
        </Text>
        
        <View style={styles.formField}>
          <Text style={styles.label}>Vehicle *</Text>
          <View style={styles.pickerContainer}>
            {vehicles.map(vehicle => (
              <TouchableOpacity
                key={vehicle.id}
                style={[
                  styles.vehicleOption,
                  newExpense.vehicleId === vehicle.id && styles.selectedVehicle
                ]}
                onPress={() => setNewExpense({...newExpense, vehicleId: vehicle.id})}
              >
                <Text style={newExpense.vehicleId === vehicle.id ? styles.selectedVehicleText : null}>
                  {vehicle.regNumber}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.formField}>
          <Text style={styles.label}>Date *</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={newExpense.date}
            onChangeText={(text) => setNewExpense({...newExpense, date: text})}
          />
        </View>
        
        <View style={styles.formField}>
          <Text style={styles.label}>Category *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Fuel, Repair, Maintenance"
            value={newExpense.category}
            onChangeText={(text) => setNewExpense({...newExpense, category: text})}
          />
        </View>
        
        <View style={styles.formField}>
          <Text style={styles.label}>Amount (₹) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            value={newExpense.amount}
            onChangeText={(text) => setNewExpense({...newExpense, amount: text})}
          />
        </View>
        
        <View style={styles.formField}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Additional notes"
            multiline
            numberOfLines={3}
            value={newExpense.notes}
            onChangeText={(text) => setNewExpense({...newExpense, notes: text})}
          />
        </View>
        
        <View style={styles.formButtons}>
          {isEditingExpense ? (
            <>
              <TouchableOpacity style={styles.updateButton} onPress={updateExpense}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => {
                  resetExpenseForm();
                  setIsEditingExpense(false);
                  setCurrentExpenseId(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.addButton} onPress={addExpense}>
              <Text style={styles.buttonText}>Add Expense</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  // Render vehicles tab content
  const renderVehiclesTab = () => (
    <View style={styles.tabContent}>
      {/* Grid header */}
      <View style={styles.gridHeader}>
        <Text style={styles.gridHeaderCell}>Reg. Number</Text>
        <Text style={styles.gridHeaderCell}>Model</Text>
        <Text style={styles.gridHeaderCell}>Capacity</Text>
        <Text style={styles.gridHeaderCell}>Driver</Text>
        <Text style={styles.gridHeaderCell}>Actions</Text>
      </View>

      {/* Vehicles List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3f51b5" />
          <Text style={styles.loadingText}>Loading vehicles...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#f44336" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.id}
          renderItem={renderVehicleItem}
          style={styles.gridList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No vehicles found</Text>
          }
        />
      )}

      {/* Form for adding/editing vehicle */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>
          {isEditingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
        </Text>
        
        <View style={styles.formField}>
          <Text style={styles.label}>Registration Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., KA 01 AB 1234"
            value={newVehicle.regNumber}
            onChangeText={(text) => setNewVehicle({...newVehicle, regNumber: text})}
          />
        </View>
        
        <View style={styles.formField}>
          <Text style={styles.label}>Model *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Ashok Leyland, Tata"
            value={newVehicle.model}
            onChangeText={(text) => setNewVehicle({...newVehicle, model: text})}
          />
        </View>
        
        <View style={styles.formField}>
          <Text style={styles.label}>Capacity *</Text>
          <TextInput
            style={styles.input}
            placeholder="Number of seats"
            keyboardType="numeric"
            value={newVehicle.capacity}
            onChangeText={(text) => setNewVehicle({...newVehicle, capacity: text})}
          />
        </View>
        
        <View style={styles.formField}>
          <Text style={styles.label}>Driver *</Text>
          <TextInput
            style={styles.input}
            placeholder="Driver name"
            value={newVehicle.driver}
            onChangeText={(text) => setNewVehicle({...newVehicle, driver: text})}
          />
        </View>
        
        <View style={styles.formButtons}>
          {isEditingVehicle ? (
            <>
              <TouchableOpacity style={styles.updateButton} onPress={updateVehicle}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => {
                  resetVehicleForm();
                  setIsEditingVehicle(false);
                  setCurrentVehicleId(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.addButton} onPress={addVehicle}>
              <Text style={styles.buttonText}>Add Vehicle</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  // Render loading state
  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3f51b5" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={64} color="#f44336" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bus Expenditure Management</Text>
      </View>
      
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'expenses' && styles.activeTab]}
          onPress={() => setActiveTab('expenses')}
        >
          <MaterialIcons name="attach-money" size={20} color={activeTab === 'expenses' ? '#fff' : '#333'} />
          <Text style={[styles.tabText, activeTab === 'expenses' && styles.activeTabText]}>Expenses</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'vehicles' && styles.activeTab]}
          onPress={() => setActiveTab('vehicles')}
        >
          <FontAwesome5 name="bus" size={18} color={activeTab === 'vehicles' ? '#fff' : '#333'} />
          <Text style={[styles.tabText, activeTab === 'vehicles' && styles.activeTabText]}>Vehicles</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {activeTab === 'expenses' ? renderExpensesTab() : renderVehiclesTab()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3f51b5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  header: {
    backgroundColor: '#3f51b5',
    padding: 16,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    backgroundColor: '#3f51b5',
  },
  tabText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  vehicleOption: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    margin: 4,
    backgroundColor: '#f9f9f9',
  },
  selectedVehicle: {
    backgroundColor: '#0066cc',
    borderColor: '#0066cc',
  },
  selectedVehicleText: {
    color: '#fff',
  },
  formButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#0066cc',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  updateButton: {
    flex: 1,
    backgroundColor: '#4cd964',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  filterOption: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    margin: 4,
    backgroundColor: '#f9f9f9',
  },
  selectedFilter: {
    backgroundColor: '#0066cc',
    borderColor: '#0066cc',
  },
  selectedFilterText: {
    color: '#fff',
  },
  expenseItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  expenseDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  expenseVehicle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  expenseNotes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  expenseActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 16,
  },
  emptyList: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    marginTop: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
  },
  gridHeader: {
    flexDirection: 'row',
    backgroundColor: '#3f51b5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  gridHeaderCell: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
  },
  gridList: {
    flex: 1,
    marginBottom: 16,
  },
  gridItem: {
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
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  gridCell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  amountCell: {
    fontWeight: 'bold',
    color: '#ff9800',
  },
  actionsCell: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#2196f3',
    marginRight: 4,
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  filterOptionSelected: {
    backgroundColor: '#0066cc',
    borderColor: '#0066cc',
  },
  filterOptionText: {
    color: '#fff',
  },
  filterOptionTextSelected: {
    color: '#fff',
  },
  tabContent: {
    flex: 1,
  },
});

export default BusExpenditureScreen; 