import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for school details
const initialSchoolDetails = {
  name: 'St Marry Champion Public School',
  address: '123 Education Lane, Knowledge City',
  phone: '+91 9876543210',
  email: 'contact@citypublicschool.edu',
  principal: 'Dr. Jagdish Sharma',
  slogan: 'Empowering minds, Shaping futures',
};

// Mock data for staff
const initialStaffList = [
  { id: '1', name: 'Ramkaran Patidar', role: 'Admin', email: 'Ramkaran@example.com', active: true },
  { id: '2', name: 'Jagdish Sharma', role: 'Accountant', email: 'Jagdish@example.com', active: true },
  { id: '3', name: 'Rakesh Singh', role: 'Staff', email: 'Rakesh@example.com', active: false },
];

// WhatsApp API settings
const initialWhatsAppSettings = {
  enabled: true,
  apiKey: 'wha_123456789abcdef',
  templateEnabled: true,
  defaultTemplate: 'Hello [PARENT_NAME], this is a message from [SCHOOL_NAME] regarding your child [STUDENT_NAME].',
};

const AdminSettingsScreen = () => {
  const [activeTab, setActiveTab] = useState('school');
  const [schoolDetails, setSchoolDetails] = useState(initialSchoolDetails);
  const [staffList, setStaffList] = useState(initialStaffList);
  const [whatsAppSettings, setWhatsAppSettings] = useState(initialWhatsAppSettings);
  const [editMode, setEditMode] = useState(false);
  const [newStaffMode, setNewStaffMode] = useState(false);
  const [newStaff, setNewStaff] = useState({
    id: '',
    name: '',
    role: 'Staff',
    email: '',
    active: true,
  });

  // Handle school details update
  const handleSchoolDetailsChange = (field, value) => {
    setSchoolDetails({
      ...schoolDetails,
      [field]: value,
    });
  };

  // Handle save school details
  const handleSaveSchoolDetails = () => {
    // In a real app, this would call an API to update the school details
    Alert.alert('Success', 'School details updated successfully.');
    setEditMode(false);
  };

  // Handle staff toggle active
  const handleToggleStaffActive = (id) => {
    setStaffList(
      staffList.map((staff) =>
        staff.id === id ? { ...staff, active: !staff.active } : staff
      )
    );
  };

  // Handle add new staff
  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.email) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const newStaffWithId = {
      ...newStaff,
      id: Date.now().toString(),
    };

    setStaffList([...staffList, newStaffWithId]);
    setNewStaff({
      id: '',
      name: '',
      role: 'Staff',
      email: '',
      active: true,
    });
    setNewStaffMode(false);
  };

  // Handle WhatsApp settings change
  const handleWhatsAppSettingsChange = (field, value) => {
    setWhatsAppSettings({
      ...whatsAppSettings,
      [field]: value,
    });
  };

  // Handle save WhatsApp settings
  const handleSaveWhatsAppSettings = () => {
    // In a real app, this would call an API to update the WhatsApp settings
    Alert.alert('Success', 'WhatsApp settings updated successfully.');
  };

  // Render school details tab
  const renderSchoolDetailsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.headerWithActions}>
        <Text style={styles.sectionTitle}>School Details</Text>
        {!editMode ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditMode(true)}
          >
            <Ionicons name="create-outline" size={18} color="#fff" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => {
                setSchoolDetails(initialSchoolDetails);
                setEditMode(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSaveSchoolDetails}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.schoolLogoContainer}>
        <View style={styles.schoolLogo}>
          <Text style={styles.schoolLogoText}>
            {schoolDetails.name.split(' ').map(word => word[0]).join('')}
          </Text>
        </View>
        {editMode && (
          <TouchableOpacity style={styles.changeLogoButton}>
            <Text style={styles.changeLogoText}>Change Logo</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>School Name</Text>
          {editMode ? (
            <TextInput
              style={styles.formInput}
              value={schoolDetails.name}
              onChangeText={(text) => handleSchoolDetailsChange('name', text)}
            />
          ) : (
            <Text style={styles.formText}>{schoolDetails.name}</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Address</Text>
          {editMode ? (
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={schoolDetails.address}
              onChangeText={(text) => handleSchoolDetailsChange('address', text)}
              multiline
              numberOfLines={3}
            />
          ) : (
            <Text style={styles.formText}>{schoolDetails.address}</Text>
          )}
        </View>

        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.formLabel}>Phone</Text>
            {editMode ? (
              <TextInput
                style={styles.formInput}
                value={schoolDetails.phone}
                onChangeText={(text) => handleSchoolDetailsChange('phone', text)}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.formText}>{schoolDetails.phone}</Text>
            )}
          </View>

          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.formLabel}>Email</Text>
            {editMode ? (
              <TextInput
                style={styles.formInput}
                value={schoolDetails.email}
                onChangeText={(text) => handleSchoolDetailsChange('email', text)}
                keyboardType="email-address"
              />
            ) : (
              <Text style={styles.formText}>{schoolDetails.email}</Text>
            )}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Principal</Text>
          {editMode ? (
            <TextInput
              style={styles.formInput}
              value={schoolDetails.principal}
              onChangeText={(text) => handleSchoolDetailsChange('principal', text)}
            />
          ) : (
            <Text style={styles.formText}>{schoolDetails.principal}</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Slogan</Text>
          {editMode ? (
            <TextInput
              style={styles.formInput}
              value={schoolDetails.slogan}
              onChangeText={(text) => handleSchoolDetailsChange('slogan', text)}
            />
          ) : (
            <Text style={styles.formText}>{schoolDetails.slogan}</Text>
          )}
        </View>
      </View>
    </View>
  );

  // Render staff tab
  const renderStaffTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.headerWithActions}>
        <Text style={styles.sectionTitle}>Staff Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setNewStaffMode(true)}
        >
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addButtonText}>Add Staff</Text>
        </TouchableOpacity>
      </View>

      {newStaffMode && (
        <View style={styles.newStaffForm}>
          <Text style={styles.formSectionTitle}>Add New Staff</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Name</Text>
            <TextInput
              style={styles.formInput}
              value={newStaff.name}
              onChangeText={(text) => setNewStaff({ ...newStaff, name: text })}
              placeholder="Enter staff name"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Email</Text>
            <TextInput
              style={styles.formInput}
              value={newStaff.email}
              onChangeText={(text) => setNewStaff({ ...newStaff, email: text })}
              placeholder="Enter email address"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Role</Text>
            <View style={styles.roleOptions}>
              {['Admin', 'Accountant', 'Staff'].map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleOption,
                    newStaff.role === role && styles.roleOptionSelected,
                  ]}
                  onPress={() => setNewStaff({ ...newStaff, role })}
                >
                  <Text
                    style={[
                      styles.roleOptionText,
                      newStaff.role === role && styles.roleOptionTextSelected,
                    ]}
                  >
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formButtons}>
            <TouchableOpacity
              style={[styles.formButton, styles.cancelFormButton]}
              onPress={() => setNewStaffMode(false)}
            >
              <Text style={styles.cancelFormButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.formButton, styles.saveFormButton]}
              onPress={handleAddStaff}
            >
              <Text style={styles.saveFormButtonText}>Add Staff</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.staffList}>
        {staffList.map((staff) => (
          <View key={staff.id} style={styles.staffItem}>
            <View style={styles.staffInfo}>
              <View style={styles.staffAvatar}>
                <Text style={styles.staffAvatarText}>
                  {staff.name.split(' ').map(word => word[0]).join('')}
                </Text>
              </View>
              <View style={styles.staffDetails}>
                <Text style={styles.staffName}>{staff.name}</Text>
                <Text style={styles.staffRole}>{staff.role}</Text>
                <Text style={styles.staffEmail}>{staff.email}</Text>
              </View>
            </View>
            <View style={styles.staffActions}>
              <View style={styles.staffStatusContainer}>
                <Text style={styles.staffStatusLabel}>
                  {staff.active ? 'Active' : 'Inactive'}
                </Text>
                <Switch
                  value={staff.active}
                  onValueChange={() => handleToggleStaffActive(staff.id)}
                  trackColor={{ false: '#ccc', true: '#4cd964' }}
                  thumbColor="#fff"
                />
              </View>
              <TouchableOpacity style={styles.staffActionButton}>
                <Ionicons name="ellipsis-vertical" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  // Render WhatsApp API tab
  const renderWhatsAppApiTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>WhatsApp API Configuration</Text>
      
      <View style={styles.formContainer}>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Enable WhatsApp Notifications</Text>
          <Switch
            value={whatsAppSettings.enabled}
            onValueChange={(value) =>
              handleWhatsAppSettingsChange('enabled', value)
            }
            trackColor={{ false: '#ccc', true: '#4cd964' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>WhatsApp API Key</Text>
          <TextInput
            style={styles.formInput}
            value={whatsAppSettings.apiKey}
            onChangeText={(text) =>
              handleWhatsAppSettingsChange('apiKey', text)
            }
            placeholder="Enter API key"
            secureTextEntry
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Enable Message Templates</Text>
          <Switch
            value={whatsAppSettings.templateEnabled}
            onValueChange={(value) =>
              handleWhatsAppSettingsChange('templateEnabled', value)
            }
            trackColor={{ false: '#ccc', true: '#4cd964' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Default Template</Text>
          <TextInput
            style={[styles.formInput, styles.textArea]}
            value={whatsAppSettings.defaultTemplate}
            onChangeText={(text) =>
              handleWhatsAppSettingsChange('defaultTemplate', text)
            }
            placeholder="Enter default message template"
            multiline
            numberOfLines={4}
          />
        </View>

        <Text style={styles.helpText}>
          Available placeholders: [SCHOOL_NAME], [PARENT_NAME], [STUDENT_NAME], [AMOUNT], [DUE_DATE]
        </Text>

        <TouchableOpacity
          style={styles.saveSettingsButton}
          onPress={handleSaveWhatsAppSettings}
        >
          <Text style={styles.saveSettingsButtonText}>Save Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Admin Settings</Text>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'school' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('school')}
        >
          <Ionicons
            name="school-outline"
            size={20}
            color={activeTab === 'school' ? '#0066cc' : '#666'}
          />
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'school' && styles.activeTabButtonText,
            ]}
          >
            School
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'staff' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('staff')}
        >
          <Ionicons
            name="people-outline"
            size={20}
            color={activeTab === 'staff' ? '#0066cc' : '#666'}
          />
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'staff' && styles.activeTabButtonText,
            ]}
          >
            Staff
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'whatsapp' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('whatsapp')}
        >
          <Ionicons
            name="logo-whatsapp"
            size={20}
            color={activeTab === 'whatsapp' ? '#0066cc' : '#666'}
          />
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'whatsapp' && styles.activeTabButtonText,
            ]}
          >
            WhatsApp
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'school' && renderSchoolDetailsTab()}
        {activeTab === 'staff' && renderStaffTab()}
        {activeTab === 'whatsapp' && renderWhatsAppApiTab()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#0066cc',
  },
  tabButtonText: {
    marginLeft: 4,
    color: '#666',
  },
  activeTabButtonText: {
    color: '#0066cc',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  headerWithActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066cc',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  editButtonText: {
    color: '#fff',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#4cd964',
  },
  cancelButtonText: {
    color: '#666',
  },
  saveButtonText: {
    color: '#fff',
  },
  schoolLogoContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  schoolLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  schoolLogoText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  changeLogoButton: {
    marginTop: 8,
  },
  changeLogoText: {
    color: '#0066cc',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 1,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  formText: {
    fontSize: 16,
    color: '#333',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  formRow: {
    flexDirection: 'row',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4cd964',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 4,
  },
  newStaffForm: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  roleOptions: {
    flexDirection: 'row',
  },
  roleOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  roleOptionSelected: {
    backgroundColor: '#0066cc',
  },
  roleOptionText: {
    color: '#666',
  },
  roleOptionTextSelected: {
    color: '#fff',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  formButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelFormButton: {
    backgroundColor: '#f0f0f0',
  },
  saveFormButton: {
    backgroundColor: '#4cd964',
  },
  cancelFormButtonText: {
    color: '#666',
  },
  saveFormButtonText: {
    color: '#fff',
  },
  staffList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
  },
  staffItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  staffInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  staffAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  staffAvatarText: {
    color: '#666',
    fontWeight: 'bold',
  },
  staffDetails: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  staffRole: {
    fontSize: 14,
    color: '#666',
  },
  staffEmail: {
    fontSize: 14,
    color: '#999',
  },
  staffActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  staffStatusContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  staffStatusLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  staffActionButton: {
    padding: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
    marginBottom: 16,
  },
  saveSettingsButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  saveSettingsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AdminSettingsScreen; 