import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for defaulters
const mockDefaulters = [
  {
    id: '1',
    name: 'Jai Patidar',
    class: '10',
    section: 'A',
    rollNumber: '101',
    pendingAmount: 15000,
    dueFor: '2 months',
    parentName: 'Rohit Patidar',
    contactNumber: '9876543210',
  },
  {
    id: '2',
    name: 'Jagdish Sharma',
    class: '10',
    section: 'B',
    rollNumber: '102',
    pendingAmount: 25000,
    dueFor: '3 months',
    parentName: 'Nandlal Sharma',
    contactNumber: '9876543211',
  },
  {
    id: '3',
    name: 'Emma Johnson',
    class: '9',
    section: 'A',
    rollNumber: '103',
    pendingAmount: 5000,
    dueFor: '1 month',
    parentName: 'Pushpendra Kumar',
    contactNumber: '9876543212',
  },
  {
    id: '4',
    name: 'Oliver Brown',
    class: '11',
    section: 'C',
    rollNumber: '104',
    pendingAmount: 35000,
    dueFor: '4 months',
    parentName: 'William Brown',
    contactNumber: '9876543213',
  },
  {
    id: '5',
    name: 'Sophia Williams',
    class: '8',
    section: 'B',
    rollNumber: '105',
    pendingAmount: 8000,
    dueFor: '1 month',
    parentName: 'James Williams',
    contactNumber: '9876543214',
  },
];

// Message templates
const messageTemplates = [
  {
    id: '1',
    title: 'Fee Reminder',
    content: 'Dear [PARENT_NAME],\n\nThis is a reminder that your child [STUDENT_NAME]\'s school fee of Rs. [AMOUNT] is pending for [DUE_PERIOD]. Kindly pay at your earliest convenience.\n\nRegards,\nSchool Admin',
  },
  {
    id: '2',
    title: 'Urgent Payment Notice',
    content: 'Dear [PARENT_NAME],\n\nYour child [STUDENT_NAME]\'s school fee of Rs. [AMOUNT] has been pending for [DUE_PERIOD]. Please clear the dues immediately to avoid any administrative action.\n\nRegards,\nSchool Admin',
  },
  {
    id: '3',
    title: 'Final Payment Notice',
    content: 'Dear [PARENT_NAME],\n\nThis is the final notice regarding your child [STUDENT_NAME]\'s pending school fee of Rs. [AMOUNT] which has been overdue for [DUE_PERIOD]. Please clear the dues within 7 days.\n\nRegards,\nSchool Admin',
  },
];

const FeeRecoveryScreen = () => {
  const [defaulters, setDefaulters] = useState(mockDefaulters);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(messageTemplates[0]);
  const [customMessage, setCustomMessage] = useState('');
  const [isCustomMessage, setIsCustomMessage] = useState(false);

  // Filter defaulters based on search and filter
  const filteredDefaulters = defaulters.filter((defaulter) => {
    const matchesSearch = defaulter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      defaulter.rollNumber.includes(searchQuery) ||
      defaulter.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === '1month') return matchesSearch && defaulter.dueFor.includes('1 month');
    if (selectedFilter === '3months') return matchesSearch && (
      defaulter.dueFor.includes('3 months') || 
      defaulter.dueFor.includes('4 months')
    );
    return matchesSearch;
  });

  // Prepare message with student details
  const getFormattedMessage = () => {
    if (!selectedStudent) return '';

    if (isCustomMessage) return customMessage;

    let message = selectedTemplate.content;
    message = message.replace('[PARENT_NAME]', selectedStudent.parentName);
    message = message.replace('[STUDENT_NAME]', selectedStudent.name);
    message = message.replace('[AMOUNT]', selectedStudent.pendingAmount.toString());
    message = message.replace('[DUE_PERIOD]', selectedStudent.dueFor);
    
    return message;
  };

  // Open WhatsApp message modal
  const handleSendMessage = (student) => {
    setSelectedStudent(student);
    setCustomMessage('');
    setIsCustomMessage(false);
    setModalVisible(true);
  };

  // Send message via WhatsApp
  const handleWhatsAppSend = () => {
    // In a real app, this would integrate with the WhatsApp Business API
    Alert.alert(
      'Message Sent',
      `WhatsApp message sent to ${selectedStudent.parentName} (${selectedStudent.contactNumber})`,
      [
        {
          text: 'OK',
          onPress: () => setModalVisible(false),
        },
      ]
    );
  };

  // Send messages to all visible defaulters
  const handleSendBulkMessages = () => {
    if (filteredDefaulters.length === 0) {
      Alert.alert('No Defaulters', 'There are no defaulters matching your filters.');
      return;
    }

    Alert.alert(
      'Send Bulk Messages',
      `Are you sure you want to send fee reminder messages to ${filteredDefaulters.length} defaulters?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send',
          onPress: () => {
            Alert.alert(
              'Messages Sent',
              `WhatsApp messages sent to ${filteredDefaulters.length} defaulters.`
            );
          },
        },
      ]
    );
  };

  // Record payment for a student
  const handleRecordPayment = (student) => {
    // Navigate to payment screen in a real app
    Alert.alert(
      'Record Payment',
      `Redirecting to payment screen for ${student.name}.`
    );
  };

  // Select message template
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setIsCustomMessage(false);
  };

  // Render defaulter item
  const renderDefaulterItem = ({ item }) => (
    <View style={styles.defaulterGridItem}>
      <View style={styles.defaulterGridRow}>
        <Text style={styles.defaulterGridName}>{item.name}</Text>
        <Text style={styles.defaulterGridClass}>
          Class {item.class}-{item.section}
        </Text>
        <Text style={styles.defaulterGridAmount}>₹{item.pendingAmount}</Text>
        <Text style={styles.defaulterGridDue}>{item.dueFor}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.payButton]}
            onPress={() => handleRecordPayment(item)}
          >
            <Ionicons name="cash-outline" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Pay</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.messageButton]}
            onPress={() => handleSendMessage(item)}
          >
            <Ionicons name="chatbubble-outline" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fee Recovery</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by student name or roll number"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'all' && styles.activeFilter]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text 
            style={[styles.filterText, selectedFilter === 'all' && styles.activeFilterText]}
          >
            All Defaulters
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === '1month' && styles.activeFilter]}
          onPress={() => setSelectedFilter('1month')}
        >
          <Text 
            style={[styles.filterText, selectedFilter === '1month' && styles.activeFilterText]}
          >
            Due 1 Month
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === '3months' && styles.activeFilter]}
          onPress={() => setSelectedFilter('3months')}
        >
          <Text 
            style={[styles.filterText, selectedFilter === '3months' && styles.activeFilterText]}
          >
            Due 3+ Months
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gridHeaderContainer}>
        <Text style={styles.gridHeaderCell}>Name</Text>
        <Text style={styles.gridHeaderCell}>Class</Text>
        <Text style={styles.gridHeaderCell}>Amount</Text>
        <Text style={styles.gridHeaderCell}>Due For</Text>
        <Text style={styles.gridHeaderCell}>Actions</Text>
      </View>

      <FlatList
        data={filteredDefaulters}
        keyExtractor={(item) => item.id}
        renderItem={renderDefaulterItem}
        style={styles.defaultersList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No defaulters found matching your filters</Text>
        }
      />

      {filteredDefaulters.length > 0 && (
        <TouchableOpacity
          style={styles.bulkMessageButton}
          onPress={handleSendBulkMessages}
        >
          <Ionicons name="mail-outline" size={20} color="#fff" />
          <Text style={styles.bulkMessageText}>
            Send Reminder to All ({filteredDefaulters.length})
          </Text>
        </TouchableOpacity>
      )}

      {/* Message Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send WhatsApp Message</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-outline" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {selectedStudent && (
              <View style={styles.studentSummary}>
                <Text style={styles.summaryName}>{selectedStudent.name}</Text>
                <Text style={styles.summaryDetail}>
                  Class {selectedStudent.class}-{selectedStudent.section} | Due: ₹{selectedStudent.pendingAmount}
                </Text>
                <View style={styles.contactInfo}>
                  <Ionicons name="call-outline" size={16} color="#666" />
                  <Text style={styles.contactText}>{selectedStudent.contactNumber}</Text>
                </View>
              </View>
            )}

            <ScrollView style={styles.templateContainer}>
              <Text style={styles.sectionTitle}>Message Templates</Text>
              
              <View style={styles.templateOptions}>
                {messageTemplates.map((template) => (
                  <TouchableOpacity
                    key={template.id}
                    style={[
                      styles.templateOption,
                      !isCustomMessage && selectedTemplate.id === template.id && styles.templateOptionSelected,
                    ]}
                    onPress={() => handleSelectTemplate(template)}
                  >
                    <Text style={styles.templateTitle}>{template.title}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[
                    styles.templateOption,
                    isCustomMessage && styles.templateOptionSelected,
                  ]}
                  onPress={() => setIsCustomMessage(true)}
                >
                  <Text style={styles.templateTitle}>Custom Message</Text>
                </TouchableOpacity>
              </View>

              {isCustomMessage ? (
                <View style={styles.customMessageContainer}>
                  <Text style={styles.inputLabel}>Enter Custom Message</Text>
                  <TextInput
                    style={styles.customMessageInput}
                    multiline
                    numberOfLines={6}
                    value={customMessage}
                    onChangeText={setCustomMessage}
                    placeholder="Type your custom message here..."
                  />
                </View>
              ) : (
                <View style={styles.messagePreviewContainer}>
                  <Text style={styles.previewLabel}>Message Preview</Text>
                  <View style={styles.messagePreview}>
                    <Text style={styles.previewText}>{getFormattedMessage()}</Text>
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleWhatsAppSend}
              >
                <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                <Text style={styles.sendButtonText}>Send via WhatsApp</Text>
              </TouchableOpacity>
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
    marginBottom: 8,
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
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  activeFilter: {
    backgroundColor: '#3f51b5',
  },
  filterText: {
    fontSize: 12,
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
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
  defaultersList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  defaulterGridItem: {
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
  defaulterGridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  defaulterGridName: {
    flex: 1,
    fontWeight: 'bold',
    color: '#333',
  },
  defaulterGridClass: {
    flex: 1,
    color: '#666',
  },
  defaulterGridAmount: {
    flex: 1,
    fontWeight: 'bold',
    color: '#ff9800',
  },
  defaulterGridDue: {
    flex: 1,
    color: '#f44336',
  },
  actionButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  payButton: {
    backgroundColor: '#4caf50',
    marginRight: 4,
  },
  messageButton: {
    backgroundColor: '#2196f3',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  bulkMessageButton: {
    backgroundColor: '#3f51b5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  bulkMessageText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  studentSummary: {
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  summaryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  templateContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  templateOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  templateOption: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  templateOptionSelected: {
    backgroundColor: '#0066cc',
  },
  templateTitle: {
    fontSize: 14,
    color: '#333',
  },
  messagePreviewContainer: {
    marginBottom: 16,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  messagePreview: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#25D366',
  },
  previewText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  customMessageContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  customMessageInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    height: 120,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default FeeRecoveryScreen; 