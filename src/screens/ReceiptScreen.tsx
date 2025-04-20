import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Student } from '../types';

interface ReceiptScreenProps {
  route: {
    params: {
      student: Student;
      paymentDetails: {
        amount: number;
        date: string;
        receiptNumber: string;
      };
    };
  };
  navigation: any;
}

const ReceiptScreen = ({ route }: ReceiptScreenProps) => {
  const { student, paymentDetails } = route.params;

  const handleShare = async () => {
    try {
      const receiptText = `
Payment Receipt
--------------
Receipt No: ${paymentDetails.receiptNumber}
Date: ${new Date(paymentDetails.date).toLocaleDateString()}

Student Details:
Name: ${student.name}
Class: ${student.class}
Roll No: ${student.rollNumber}

Amount Paid: ₹${paymentDetails.amount}

Thank you for your payment!
      `;

      await Share.share({
        message: receiptText,
        title: `Receipt - ${paymentDetails.receiptNumber}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share receipt');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.receipt}>
        <View style={styles.header}>
          <Text style={styles.schoolName}>SCHOOL NAME</Text>
          <Text style={styles.receiptTitle}>Payment Receipt</Text>
        </View>

        <View style={styles.receiptDetails}>
          <View style={styles.row}>
            <Text style={styles.label}>Receipt No:</Text>
            <Text style={styles.value}>{paymentDetails.receiptNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>
              {new Date(paymentDetails.date).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.studentDetails}>
          <Text style={styles.sectionTitle}>Student Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{student.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Class:</Text>
            <Text style={styles.value}>{student.class}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Roll No:</Text>
            <Text style={styles.value}>{student.rollNumber}</Text>
          </View>
        </View>

        <View style={styles.paymentDetails}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Amount Paid:</Text>
            <Text style={styles.amount}>₹{paymentDetails.amount}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for your payment!</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Ionicons name="share-outline" size={24} color="#fff" />
        <Text style={styles.shareButtonText}>Share Receipt</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  receipt: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 20,
  },
  schoolName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  receiptTitle: {
    fontSize: 18,
    color: '#666',
  },
  receiptDetails: {
    marginBottom: 20,
  },
  studentDetails: {
    marginBottom: 20,
  },
  paymentDetails: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#666',
    flex: 1,
  },
  value: {
    flex: 2,
    textAlign: 'right',
  },
  amount: {
    flex: 2,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    color: '#666',
    fontStyle: 'italic',
  },
  shareButton: {
    backgroundColor: '#0066cc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReceiptScreen; 