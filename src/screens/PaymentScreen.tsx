import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import type { Student, FeePayment } from '../types';

interface PaymentScreenProps {
  route: {
    params: {
      student: Student & { fees: FeePayment[] };
    };
  };
  navigation: any;
}

const PaymentScreen = ({ route, navigation }: PaymentScreenProps) => {
  const { student } = route.params;
  const [selectedFees, setSelectedFees] = useState<string[]>([]);

  const handlePayment = async () => {
    if (selectedFees.length === 0) {
      Alert.alert('Error', 'Please select at least one fee to pay');
      return;
    }

    try {
      // TODO: Replace with actual API call
      // const response = await api.recordPayment({
      //   studentId: student.id,
      //   feeIds: selectedFees,
      //   paymentMode: 'CASH',
      // });

      // Navigate to receipt screen with payment details
      navigation.navigate('Receipt', {
        student,
        paymentDetails: {
          amount: student.fees
            .filter(fee => selectedFees.includes(fee.id))
            .reduce((sum, fee) => sum + fee.amount, 0),
          date: new Date().toISOString(),
          receiptNumber: 'RCPT' + Date.now(),
        },
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to process payment');
    }
  };

  const toggleFeeSelection = (feeId: string) => {
    setSelectedFees(prev =>
      prev.includes(feeId)
        ? prev.filter(id => id !== feeId)
        : [...prev, feeId]
    );
  };

  const pendingFees = student.fees.filter(fee => fee.status === 'PENDING');
  const totalSelected = student.fees
    .filter(fee => selectedFees.includes(fee.id))
    .reduce((sum, fee) => sum + fee.amount, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.studentName}>{student.name}</Text>
        <Text style={styles.classInfo}>Class: {student.class}</Text>
      </View>

      <ScrollView style={styles.feeList}>
        <Text style={styles.sectionTitle}>Pending Fees</Text>
        {pendingFees.map(fee => (
          <TouchableOpacity
            key={fee.id}
            style={[
              styles.feeItem,
              selectedFees.includes(fee.id) && styles.selectedFee,
            ]}
            onPress={() => toggleFeeSelection(fee.id)}
          >
            <View style={styles.feeDetails}>
              <Text style={styles.feeType}>{fee.feeType}</Text>
              <Text style={styles.dueDate}>Due: {new Date(fee.dueDate).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.amount}>₹{fee.amount}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Selected:</Text>
          <Text style={styles.totalAmount}>₹{totalSelected}</Text>
        </View>
        <TouchableOpacity
          style={[styles.payButton, !selectedFees.length && styles.disabledButton]}
          onPress={handlePayment}
          disabled={!selectedFees.length}
        >
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  classInfo: {
    fontSize: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 16,
  },
  feeList: {
    flex: 1,
  },
  feeItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedFee: {
    backgroundColor: '#e6f0ff',
    borderWidth: 1,
    borderColor: '#0066cc',
  },
  feeDetails: {
    flex: 1,
  },
  feeType: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  dueDate: {
    color: '#666',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen; 