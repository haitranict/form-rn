import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { FieldWrapper } from '../layout/FieldWrapper';
import { useTheme } from '../../theme';
import { useFormField } from '../../hooks/useFormField';
export function SelectField({
  config
}) {
  const theme = useTheme();
  const {
    value,
    error,
    onChange,
    onBlur,
    isVisible,
    isDisabled,
    isRequired
  } = useFormField(config);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  if (!isVisible) return null;
  const selected = config.options.find(o => o.value === value);
  const filtered = config.searchable ? config.options.filter(o => o.label.toLowerCase().includes(search.toLowerCase())) : config.options;
  const styles = StyleSheet.create({
    trigger: {
      height: theme.sizes.inputHeight,
      borderWidth: theme.shape.borderWidth,
      borderColor: error ? theme.colors.danger : theme.colors.border,
      borderRadius: theme.shape.borderRadius,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.fieldPaddingH,
      backgroundColor: isDisabled ? theme.colors.labelBackground : theme.colors.inputBackground
    },
    triggerText: {
      flex: 1,
      fontSize: theme.typography.fontSizeInput,
      color: selected ? theme.colors.text : theme.colors.placeholder
    },
    arrow: {
      fontSize: 12,
      color: theme.colors.textSecondary
    },
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'flex-end'
    },
    sheet: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      maxHeight: '60%'
    },
    searchInput: {
      margin: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.shape.borderRadius,
      paddingHorizontal: 12,
      height: 40,
      fontSize: theme.typography.fontSizeInput
    },
    option: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border
    },
    optionText: {
      fontSize: theme.typography.fontSizeInput,
      color: theme.colors.text
    },
    optionSelected: {
      color: theme.colors.primary,
      fontWeight: '600'
    }
  });
  return /*#__PURE__*/React.createElement(FieldWrapper, {
    label: config.label,
    description: config.description,
    error: error?.message,
    required: isRequired
  }, /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: styles.trigger,
    onPress: () => {
      if (!isDisabled) setOpen(true);
    },
    activeOpacity: 0.7,
    accessibilityLabel: config.label
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.triggerText
  }, selected?.label ?? config.placeholder ?? 'Select...'), /*#__PURE__*/React.createElement(Text, {
    style: styles.arrow
  }, "\u25BC")), /*#__PURE__*/React.createElement(Modal, {
    visible: open,
    transparent: true,
    animationType: "slide",
    onRequestClose: () => setOpen(false)
  }, /*#__PURE__*/React.createElement(SafeAreaView, {
    style: styles.modal
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.sheet
  }, config.searchable ? /*#__PURE__*/React.createElement(TextInput, {
    style: styles.searchInput,
    value: search,
    onChangeText: setSearch,
    placeholder: "Search...",
    placeholderTextColor: theme.colors.placeholder
  }) : null, /*#__PURE__*/React.createElement(FlatList, {
    data: filtered,
    keyExtractor: item => String(item.value),
    renderItem: ({
      item
    }) => /*#__PURE__*/React.createElement(TouchableOpacity, {
      style: styles.option,
      onPress: () => {
        onChange(item.value);
        onBlur();
        setOpen(false);
        setSearch('');
      }
    }, /*#__PURE__*/React.createElement(Text, {
      style: [styles.optionText, item.value === value && styles.optionSelected]
    }, item.label))
  })))));
}
//# sourceMappingURL=SelectField.js.map