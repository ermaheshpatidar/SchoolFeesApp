import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Standard search input component
interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
}) => {
  return (
    <View style={styles.searchBar}>
      <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
      {value ? (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => {
            onChangeText('');
            if (onClear) onClear();
          }}
        >
          <Ionicons name="close-circle" size={20} color="#999" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

// Filter chip component
interface FilterOptionProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export const FilterOption: React.FC<FilterOptionProps> = ({
  label,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.filterOption,
        selected && styles.selectedFilterOption,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterOptionText,
          selected && styles.selectedFilterOptionText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// Filter options row
interface FilterRowProps {
  label: string;
  children: React.ReactNode;
}

export const FilterRow: React.FC<FilterRowProps> = ({
  label,
  children,
}) => {
  return (
    <View style={styles.filterRow}>
      <Text style={styles.filterLabel}>{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterOptions}
      >
        {children}
      </ScrollView>
    </View>
  );
};

// Action button component
interface ActionButtonProps {
  icon: any;
  label: string;
  onPress: () => void;
  primary?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onPress,
  primary = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        primary ? styles.primaryButton : styles.secondaryButton,
      ]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={20} color={primary ? '#fff' : '#0066cc'} />
      <Text style={[
        styles.actionButtonText,
        primary ? styles.primaryButtonText : styles.secondaryButtonText,
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// Collapsible search panel
interface CollapsibleSearchProps {
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const CollapsibleSearch: React.FC<CollapsibleSearchProps> = ({
  isExpanded,
  onToggle,
  children,
}) => {
  return (
    <View style={styles.collapsibleContainer}>
      <TouchableOpacity 
        style={[
          styles.collapsibleHeader,
          isExpanded && styles.collapsibleHeaderExpanded
        ]}
        onPress={onToggle}
      >
        <Text style={styles.collapsibleHeaderText}>Search & Filters</Text>
        <Ionicons 
          name={isExpanded ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color="#666" 
        />
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.collapsibleContent}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    paddingHorizontal: 12,
    marginBottom: 8,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  filterRow: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#555',
  },
  filterOptions: {
    flexDirection: 'row',
    paddingBottom: 4,
  },
  filterOption: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  selectedFilterOption: {
    backgroundColor: '#3f51b5',
  },
  filterOptionText: {
    color: '#333',
  },
  selectedFilterOptionText: {
    color: '#fff',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: '#3f51b5',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0066cc',
  },
  actionButtonText: {
    fontWeight: '500',
    marginLeft: 8,
  },
  primaryButtonText: {
    color: '#fff',
  },
  secondaryButtonText: {
    color: '#0066cc',
  },
  collapsibleContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0,
    borderBottomColor: '#eee',
  },
  collapsibleHeaderExpanded: {
    borderBottomWidth: 1,
  },
  collapsibleHeaderText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  collapsibleContent: {
    padding: 16,
  },
});

export default {
  SearchBar,
  FilterOption,
  FilterRow,
  ActionButton,
  CollapsibleSearch,
}; 