import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchStudents } from '../services/api';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, this would make a specific search API call
      // For demo, we'll use the fetchStudents API and filter client-side
      const response = await fetchStudents();
      
      if (response && response.success) {
        const filteredResults = response.data.filter(student => 
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.rollNumber.includes(searchQuery) ||
          student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setSearchResults(filteredResults);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentPress = (student) => {
    // Navigate to student details or fee collection screen
    navigation.navigate('Fees', { 
      screen: 'FeeCollection',
      params: { studentId: student.id }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, roll no, or admission no"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.resultItem}
              onPress={() => handleStudentPress(item)}
            >
              <View style={styles.resultContent}>
                <Text style={styles.studentName}>{item.name}</Text>
                <Text style={styles.studentDetails}>
                  Class {item.class}-{item.section} | Roll: {item.rollNumber}
                </Text>
                <Text style={styles.studentDetails}>
                  Admission No: {item.admissionNumber}
                </Text>
              </View>
              <View style={styles.pendingFeeContainer}>
                <Text style={[
                  styles.pendingFee,
                  item.pendingFees > 0 ? styles.pendingPositive : styles.pendingZero
                ]}>
                  ₹{item.pendingFees}
                </Text>
                <Text style={styles.pendingLabel}>
                  {item.pendingFees > 0 ? 'Due' : 'Paid'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={64} color="#ccc" />
              <Text style={styles.emptyText}>
                {searchQuery ? 'No students found matching your search' : 'Search for students using the search bar above'}
              </Text>
            </View>
          }
        />
      )}
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
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    elevation: 2,
  },
  resultContent: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  studentDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  pendingFeeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 16,
  },
  pendingFee: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pendingPositive: {
    color: '#ff3b30',
  },
  pendingZero: {
    color: '#4cd964',
  },
  pendingLabel: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 64,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default SearchScreen; 