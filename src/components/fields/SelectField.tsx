import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, FlatList,
  StyleSheet, SafeAreaView, TextInput,
} from 'react-native';
import { FieldWrapper } from '../layout/FieldWrapper';
import { useTheme } from '../../theme';
import { useFormField } from '../../hooks/useFormField';
import type { SelectFieldConfig, FieldOption } from '../../types/field.types';

interface SelectFieldProps {
  config: SelectFieldConfig;
}

export function SelectField({ config }: SelectFieldProps) {
  const theme = useTheme();
  const { value, error, onChange, onBlur, isVisible, isDisabled, isRequired } = useFormField(config);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  if (!isVisible) return null;

  const selected = config.options.find((o) => o.value === value);
  const filtered = config.searchable
    ? config.options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : config.options;

  const styles = StyleSheet.create({
    trigger: {
      height: theme.sizes.inputHeight,
      borderWidth: theme.shape.borderWidth,
      borderColor: error ? theme.colors.danger : theme.colors.border,
      borderRadius: theme.shape.borderRadius,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.fieldPaddingH,
      backgroundColor: isDisabled ? theme.colors.labelBackground : theme.colors.inputBackground,
    },
    triggerText: {
      flex: 1,
      fontSize: theme.typography.fontSizeInput,
      color: selected ? theme.colors.text : theme.colors.placeholder,
    },
    arrow: { fontSize: 12, color: theme.colors.textSecondary },
    modal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    sheet: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      maxHeight: '60%',
    },
    searchInput: {
      margin: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.shape.borderRadius,
      paddingHorizontal: 12,
      height: 40,
      fontSize: theme.typography.fontSizeInput,
    },
    option: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    optionText: { fontSize: theme.typography.fontSizeInput, color: theme.colors.text },
    optionSelected: { color: theme.colors.primary, fontWeight: '600' },
  });

  return (
    <FieldWrapper label={config.label} description={config.description} error={error?.message} required={isRequired}>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => { if (!isDisabled) setOpen(true); }}
        activeOpacity={0.7}
        accessibilityLabel={config.label}
      >
        <Text style={styles.triggerText}>
          {selected?.label ?? config.placeholder ?? 'Select...'}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.sheet}>
            {config.searchable ? (
              <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Search..."
                placeholderTextColor={theme.colors.placeholder}
              />
            ) : null}
            <FlatList
              data={filtered}
              keyExtractor={(item: FieldOption) => String(item.value)}
              renderItem={({ item }: { item: FieldOption }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onChange(item.value);
                    onBlur();
                    setOpen(false);
                    setSearch('');
                  }}
                >
                  <Text style={[styles.optionText, item.value === value && styles.optionSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </FieldWrapper>
  );
}
