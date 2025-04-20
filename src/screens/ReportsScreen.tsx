import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for reports
const reportTypes = [
  {
    id: 'fee-collection',
    title: 'Fee Collection Reports',
    icon: 'cash-outline',
    reports: [
      { id: 'daily', title: 'Daily Collection', description: 'View fee collection for specific date' },
      { id: 'monthly', title: 'Monthly Collection', description: 'View fee collection by month' },
      { id: 'class-wise', title: 'Class-wise Collection', description: 'View fee collection by class' },
      { id: 'student-wise', title: 'Student-wise Collection', description: 'View fee collection by student' },
    ],
  },
  {
    id: 'fee-dues',
    title: 'Fee Due Reports',
    icon: 'alert-circle-outline',
    reports: [
      { id: 'pending', title: 'Pending Dues', description: 'List of students with pending fees' },
      { id: 'defaulters', title: 'Defaulters', description: 'List of defaulters (due > 2 months)' },
      { id: 'class-wise-dues', title: 'Class-wise Dues', description: 'Pending dues by class' },
    ],
  },
  {
    id: 'bus-reports',
    title: 'Bus Reports',
    icon: 'bus-outline',
    reports: [
      { id: 'bus-collection', title: 'Bus Fee Collection', description: 'View bus fee collection' },
      { id: 'bus-expenses', title: 'Bus Expenses', description: 'View bus expenses' },
      { id: 'bus-profit-loss', title: 'Bus Profit/Loss', description: 'Compare bus fee collection vs expenses' },
      { id: 'bus-student', title: 'Bus-wise Students', description: 'List of students using each bus' },
    ],
  },
  {
    id: 'receipts',
    title: 'Receipts',
    icon: 'document-text-outline',
    reports: [
      { id: 'receipt-search', title: 'Search Receipts', description: 'Search for specific receipt' },
      { id: 'receipt-date', title: 'Receipts by Date', description: 'View receipts for specific date range' },
    ],
  },
];

// Mock data for report results
const mockFeeCollectionData = [
  { id: '1', date: '15 Apr 2023', amount: 25000, students: 10, mode: 'Cash' },
  { id: '2', date: '16 Apr 2023', amount: 35000, students: 15, mode: 'Online' },
  { id: '3', date: '17 Apr 2023', amount: 15000, students: 6, mode: 'Cash' },
  { id: '4', date: '18 Apr 2023', amount: 42000, students: 18, mode: 'Mixed' },
  { id: '5', date: '19 Apr 2023', amount: 28000, students: 12, mode: 'Cash' },
];

const ReportsScreen = () => {
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [reportData, setReportData] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Handle report type selection
  const handleReportTypeSelect = (reportType) => {
    setSelectedReportType(reportType);
    setSelectedReport(null);
    setShowResults(false);
  };

  // Handle individual report selection
  const handleReportSelect = (report) => {
    setSelectedReport(report);
    
    if (report.id === 'daily' || report.id === 'monthly' || report.id === 'receipt-date') {
      setModalVisible(true);
    } else {
      // For reports that don't need date inputs, show results immediately
      setReportData(mockFeeCollectionData);
      setShowResults(true);
    }
  };

  // Handle generating report after date selection
  const handleGenerateReport = () => {
    setModalVisible(false);
    setReportData(mockFeeCollectionData);
    setShowResults(true);
  };

  // Handle exporting report to PDF or Excel
  const handleExportReport = (format) => {
    // In a real app, this would trigger the export functionality
    alert(`Report exported as ${format}.`);
  };

  // Render report type item
  const renderReportTypeItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.reportTypeCard,
        selectedReportType?.id === item.id && styles.selectedReportTypeCard,
      ]}
      onPress={() => handleReportTypeSelect(item)}
    >
      <Ionicons
        name={item.icon}
        size={28}
        color={selectedReportType?.id === item.id ? '#0066cc' : '#666'}
      />
      <Text
        style={[
          styles.reportTypeTitle,
          selectedReportType?.id === item.id && styles.selectedReportTypeTitle,
        ]}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  // Render individual report item
  const renderReportItem = ({ item }) => (
    <TouchableOpacity
      style={styles.reportCard}
      onPress={() => handleReportSelect(item)}
    >
      <View style={styles.reportCardContent}>
        <Text style={styles.reportTitle}>{item.title}</Text>
        <Text style={styles.reportDescription}>{item.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  // Render report results
  const renderReportResults = () => {
    if (!showResults) return null;

    return (
      <View style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {selectedReport?.title} Report
          </Text>
          <View style={styles.exportButtons}>
            <TouchableOpacity
              style={[styles.exportButton, styles.pdfButton]}
              onPress={() => handleExportReport('PDF')}
            >
              <Ionicons name="document-outline" size={16} color="#fff" />
              <Text style={styles.exportButtonText}>PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.exportButton, styles.excelButton]}
              onPress={() => handleExportReport('Excel')}
            >
              <Ionicons name="grid-outline" size={16} color="#fff" />
              <Text style={styles.exportButtonText}>Excel</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Date</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Amount</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Students</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Mode</Text>
        </View>

        <FlatList
          data={reportData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.date}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>₹{item.amount}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{item.students}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{item.mode}</Text>
            </View>
          )}
          ListFooterComponent={
            <View style={styles.tableSummary}>
              <Text style={styles.tableSummaryText}>
                Total: ₹{reportData.reduce((sum, item) => sum + item.amount, 0)}
              </Text>
              <Text style={styles.tableSummaryText}>
                Students: {reportData.reduce((sum, item) => sum + item.students, 0)}
              </Text>
            </View>
          }
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Reports</Text>
      
      <View style={styles.reportTypesContainer}>
        <FlatList
          data={reportTypes}
          keyExtractor={(item) => item.id}
          renderItem={renderReportTypeItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.reportTypesList}
        />
      </View>

      <View style={styles.content}>
        {selectedReportType ? (
          <>
            <Text style={styles.sectionTitle}>{selectedReportType.title}</Text>
            <FlatList
              data={selectedReportType.reports}
              keyExtractor={(item) => item.id}
              renderItem={renderReportItem}
              contentContainerStyle={styles.reportsList}
              showsVerticalScrollIndicator={false}
              style={styles.reportsListContainer}
            />
          </>
        ) : (
          <View style={styles.noSelectionContainer}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={styles.noSelectionText}>
              Select a report type to view available reports
            </Text>
          </View>
        )}

        {renderReportResults()}
      </View>

      {/* Date Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date Range</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-outline" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.dateInputContainer}>
              <View style={styles.dateInputGroup}>
                <Text style={styles.dateInputLabel}>From Date</Text>
                <TextInput
                  style={styles.dateInput}
                  placeholder="DD/MM/YYYY"
                  value={dateRange.from}
                  onChangeText={(text) => setDateRange({ ...dateRange, from: text })}
                />
              </View>

              <View style={styles.dateInputGroup}>
                <Text style={styles.dateInputLabel}>To Date</Text>
                <TextInput
                  style={styles.dateInput}
                  placeholder="DD/MM/YYYY"
                  value={dateRange.to}
                  onChangeText={(text) => setDateRange({ ...dateRange, to: text })}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGenerateReport}
            >
              <Text style={styles.generateButtonText}>Generate Report</Text>
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
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  reportTypesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  reportTypesList: {
    paddingHorizontal: 16,
  },
  reportTypeCard: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    marginRight: 12,
    width: 120,
  },
  selectedReportTypeCard: {
    backgroundColor: '#e6f2ff',
    borderWidth: 1,
    borderColor: '#0066cc',
  },
  reportTypeTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  selectedReportTypeTitle: {
    color: '#0066cc',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  reportsListContainer: {
    flex: 1,
  },
  reportsList: {
    paddingBottom: 16,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  reportCardContent: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: '#666',
  },
  noSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  noSelectionText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
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
    width: '90%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dateInputContainer: {
    marginBottom: 16,
  },
  dateInputGroup: {
    marginBottom: 16,
  },
  dateInputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  dateInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  generateButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  resultsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    elevation: 2,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  exportButtons: {
    flexDirection: 'row',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  pdfButton: {
    backgroundColor: '#ff3b30',
  },
  excelButton: {
    backgroundColor: '#4cd964',
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderCell: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableCell: {
    fontSize: 14,
    color: '#666',
  },
  tableSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  tableSummaryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ReportsScreen; 