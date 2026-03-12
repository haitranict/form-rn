import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, FlatList,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { FieldWrapper } from '../layout/FieldWrapper';
import { useTheme } from '../../theme';
import { useFormField } from '../../hooks/useFormField';
import type { MultiSelectFieldConfig, FieldOption } from '../../types/field.types';

interface MultiSelectFieldProps {
  config: MultiSelectFieldConfig;
}

export function MultiSelectField({ config }: MultiSelectFieldProps) {
  const theme = useTheme();
  const { value, error, onChange, onBlur, isVisible, isDisabled, isRequired } = useFormField(config);
  const [open, setOpen] = useState(false);

  if (!isVisible) return null;

  const selected: unknown[] = Array.isArray(value) ? value : [];

  const toggle = (optVal: unknown) => {
    const exists = selected.includes(optVal);
    let next: unknown[];
    if (exists) {
      next = selected.filter((v) => v !== optVal);
    } else {
      if (config.maxSelections && selected.length >= config.maxSelections) return;
      next = [...selected, optVal];
    }
    onChange(next);
  };

  const displayText = config.options
    .filter((o) => selected.includes(o.value))
    .map((o) => o.label)
    .join(', ');

  const styles = StyleSheet.create({
    trigger: {
      minHeight: theme.sizes.inputHeight,
      borderWidth: theme.shape.borderWidth,
      borderColor: error ? theme.colors.danger : theme.colors.border,
      borderRadius: theme.shape.borderRadius,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.fieldPaddingH,
      paddingVertical: 8,
      backgroundColor: isDisabled ? theme.colors.labelBackground : theme.colors.inputBackground,
    },
    triggerText: {
      flex: 1,
      fontSize: theme.typography.fontSizeInput,
      color: displayText ? theme.colors.text : theme.colors.placeholder,
    },
    arrow: { fontSize: 12, color: theme.colors.textSecondary },
    modal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    sheet: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      maxHeight: '60%',
    },
    doneButton: {
      padding: 16,
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    doneText: { color: theme.colors.primary, fontWeight: '600', fontSize: 16 },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    box: {
      width: 20, height: 20, borderRadius: 4, borderWidth: 2,
      alignItems: 'center', justifyContent: 'center', marginRight: 12,
    },
    checkmark: { color: theme.colors.white, fontSize: 12, fontWeight: '700' },
    optionText: { fontSize: theme.typography.fontSizeInput, color: theme.colors.text },
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
          {displayText || (config.placeholder ?? 'Select options...')}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => { onBlur(); setOpen(false); }}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.sheet}>
            <FlatList
              data={config.options}
              keyExtractor={(item: FieldOption) => String(item.value)}
              renderItem={({ item }: { item: FieldOption }) => {
                const checked = selected.includes(item.value);
                return (
                  <TouchableOpacity style={styles.option} onPress={() => toggle(item.value)}>
                    <View style={[styles.box, { borderColor: checked ? theme.colors.primary : theme.colors.border, backgroundColor: checked ? theme.colors.primary : 'transparent' }]}>
                      {checked ? <Text style={styles.checkmark}>✓</Text> : null}
                    </View>
                    <Text style={styles.optionText}>{item.label}</Text>
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity style={styles.doneButton} onPress={() => { onBlur(); setOpen(false); }}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </FieldWrapper>
  );
}
