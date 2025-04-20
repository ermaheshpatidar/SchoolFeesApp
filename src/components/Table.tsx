import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Column {
  key: string;
  title: string;
  width?: number;
  render?: (item: any) => React.ReactNode;
}

interface Action {
  icon: any;
  color: string;
  onPress: (item: any) => void;
  label?: string;
}

interface TableProps {
  data: any[];
  columns: Column[];
  actions?: Action[];
  keyExtractor: (item: any) => string;
  onRowPress?: (item: any) => void;
  emptyState?: React.ReactNode;
}

const Table = ({
  data,
  columns,
  actions = [],
  keyExtractor,
  onRowPress,
  emptyState,
}: TableProps) => {
  const screenWidth = Dimensions.get('window').width;
  
  // If there's no data, show empty state
  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        {emptyState || (
          <>
            <Ionicons name="document-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No data available</Text>
          </>
        )}
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Table Header */}
      <View style={styles.headerRow}>
        {columns.map((column) => (
          <View
            key={column.key}
            style={[
              styles.headerCell,
              column.width ? { width: column.width } : { flex: 1 } as ViewStyle
            ]}
          >
            <Text style={styles.headerText}>{column.title}</Text>
          </View>
        ))}
        {actions.length > 0 && (
          <View style={styles.actionHeaderCell}>
            <Text style={styles.headerText}>Actions</Text>
          </View>
        )}
      </View>
      
      {/* Table Body */}
      <ScrollView>
        {data.map((item) => (
          <TouchableOpacity
            key={keyExtractor(item)}
            style={styles.row}
            onPress={onRowPress ? () => onRowPress(item) : undefined}
            activeOpacity={onRowPress ? 0.7 : 1}
          >
            {columns.map((column) => (
              <View
                key={`${keyExtractor(item)}-${column.key}`}
                style={[
                  styles.cell,
                  column.width ? { width: column.width } : { flex: 1 } as ViewStyle
                ]}
              >
                {column.render ? (
                  column.render(item)
                ) : (
                  <Text style={styles.cellText} numberOfLines={1}>
                    {item[column.key]}
                  </Text>
                )}
              </View>
            ))}
            
            {actions.length > 0 && (
              <View style={styles.actionCell}>
                {actions.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.actionButton}
                    onPress={() => action.onPress(item)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name={action.icon} size={18} color={action.color} />
                    {action.label && (
                      <Text style={[styles.actionText, { color: action.color }]}>
                        {action.label}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerCell: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  actionHeaderCell: {
    width: 120,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#555',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  cell: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 14,
    color: '#333',
  },
  actionCell: {
    width: 120,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  actionButton: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  actionText: {
    fontSize: 12,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});

export default Table; 