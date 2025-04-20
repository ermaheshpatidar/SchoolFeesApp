import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Define user data interface
interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  joinedDate: string;
  avatar: string | null;
  school: string;
  department: string;
}

// Mock user data - in a real app, this would come from a backend API
const mockUserData: UserData = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@schoolmgmt.com',
  phone: '+91 9876543210',
  role: 'Administrator',
  joinedDate: '2022-01-15',
  avatar: null, // This would be a URL in a real app
  school: 'Delhi Public School',
  department: 'Administration',
};

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<UserData>(mockUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserData>({ ...mockUserData });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Function to toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Cancel editing
      setEditedUser({ ...user });
    }
    setIsEditing(!isEditing);
  };

  // Function to handle input changes
  const handleInputChange = (field: keyof UserData, value: string) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Function to save profile changes
  const saveProfile = async () => {
    setIsSaving(true);
    try {
      // In a real app, you would make an API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Update user data
      setUser(editedUser);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Function to sign out
  const signOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => {
            // In a real app, you would clear the auth token and navigate to login
            console.log('User signed out');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImagePlaceholderText}>
                {user.name.split(' ').map(part => part[0]).join('')}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>{user.role}</Text>
        </View>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={toggleEditMode}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name={isEditing ? "close" : "edit"} 
            size={20} 
            color="white" 
          />
          <Text style={styles.editButtonText}>
            {isEditing ? "Cancel" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        {isEditing ? (
          // Edit Form
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={editedUser.name}
                onChangeText={value => handleInputChange('name', value)}
                placeholder="Enter your full name"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={editedUser.email}
                onChangeText={value => handleInputChange('email', value)}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={editedUser.phone}
                onChangeText={value => handleInputChange('phone', value)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Department</Text>
              <TextInput
                style={styles.input}
                value={editedUser.department}
                onChangeText={value => handleInputChange('department', value)}
                placeholder="Enter your department"
              />
            </View>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={saveProfile}
              disabled={isSaving}
              activeOpacity={0.7}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          // Info Display
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <MaterialIcons name="email" size={20} color="#555" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialIcons name="phone" size={20} color="#555" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{user.phone}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialIcons name="business" size={20} color="#555" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>School</Text>
                <Text style={styles.infoValue}>{user.school}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialIcons name="domain" size={20} color="#555" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Department</Text>
                <Text style={styles.infoValue}>{user.department}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialIcons name="date-range" size={20} color="#555" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Joined</Text>
                <Text style={styles.infoValue}>{new Date(user.joinedDate).toLocaleDateString()}</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity 
        style={styles.signOutButton}
        onPress={signOut}
        activeOpacity={0.7}
      >
        <MaterialIcons name="logout" size={20} color="white" />
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
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
    marginTop: 10,
    color: '#333',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#3498db',
  },
  profileImageContainer: {
    marginRight: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'white',
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2980b9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  profileImagePlaceholderText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  role: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
  },
  editButton: {
    backgroundColor: '#2980b9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  infoContainer: {
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#777',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  form: {
    marginTop: 10,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: '#e74c3c',
    margin: 15,
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 30,
  },
  signOutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ProfileScreen; 