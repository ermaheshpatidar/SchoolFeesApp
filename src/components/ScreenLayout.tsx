import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ScreenLayoutProps {
  title: string;
  children: ReactNode;
  actionButtons?: ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  title,
  children,
  actionButtons,
  showBackButton = false,
  onBackPress,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#3f51b5" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {showBackButton && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBackPress}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        
        {actionButtons && (
          <View style={styles.headerActions}>
            {actionButtons}
          </View>
        )}
      </View>
      
      {/* Main Content */}
      <View style={styles.content}>
        {children}
      </View>
    </SafeAreaView>
  );
};

// Also create SearchPanel component for consistent search/filter UI
interface SearchPanelProps {
  children: ReactNode;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({ children }) => {
  return (
    <View style={styles.searchPanel}>
      {children}
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
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  searchPanel: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 1,
  },
});

export default ScreenLayout; 