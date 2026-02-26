export const colors = {
  ground: '#B5E4FF',
  secondaryGround: '#010529',
  background: 'rgba(1, 5, 41, 0.30)',
  textPrimary: '#DDF2F6',
  textSecondary: '#b8c2c2'
}

export const typography = {
  title: { fontSize: 24, color: colors.textPrimary, fontWeight: 'bold' as const},
  heading: { fontSize: 18, color: colors.textPrimary, fontWeight: 'bold' as const },
  body: { fontSize: 14, color: colors.textPrimary },
  strong: { fontSize: 14, color: colors.textPrimary, fontWeight: 'bold' as const },
  fine: { fontSize: 12, color: colors.textSecondary },
  button: { fontSize: 15, color: colors.textPrimary },
};

export const layout = {
  card: { margin: 4, padding: 8, borderRadius: 2, backgroundColor: colors.background },
  field: { margin: 2, padding: 2, paddingLeft: 8, paddingRight: 8, borderRadius: 2, backgroundColor: colors.background },
  row: { flexDirection: 'row' as const, alignItems: 'center' as const },
  button: { ...typography.body, padding: 4, margin: 2, backgroundColor: colors.background,  }
};