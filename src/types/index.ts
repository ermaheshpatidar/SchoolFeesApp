export interface Student {
  id: string;
  name: string;
  class: string;
  rollNumber: string;
  parentName: string;
  contactNumber: string;
}

export interface FeePayment {
  id: string;
  studentId: string;
  amount: number;
  paymentDate: string;
  paymentMode: 'CASH' | 'ONLINE';
  receiptNumber: string;
  status: 'PAID' | 'PENDING';
  dueDate: string;
  feeType: string;
}

export interface DashboardStats {
  totalCollectedToday: number;
  totalPending: number;
  totalStudents: number;
  recentPayments: FeePayment[];
} 