// app/theme.ts
export const colors = {
  primary: '#4a90e2',
  danger: 'red',
  card: '#f5f5f5',
  nestedCard: '#ececec',
  border: '#ddd',
  borderLight: '#eee',
  textPrimary: '#000',
  textSecondary: '#444',
  textMuted: '#888',
  textLight: '#aaa',
  activeFieldBg: '#e8f0fe',
  activeFieldBorder: '#4a90e2',
  draggingBg: '#e0e8ff',
  white: '#fff',
};

export const typography = {
  heading: { fontSize: 18, fontWeight: 'bold' as const },
  body: { fontSize: 16 },
  meta: { fontSize: 14, color: colors.textMuted },
  label: { fontSize: 16, color: colors.textSecondary },
};

export const layout = {
  card: { margin: 8, padding: 12, borderRadius: 8 },
  field: { padding: 8, borderRadius: 6 },
  row: { flexDirection: 'row' as const, alignItems: 'center' as const },
};