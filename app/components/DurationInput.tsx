import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface DurationInputProps {
  value: number; // seconds
  onChange: (seconds: number) => void;
}

function fromSeconds(s: number): number[] {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [
    Math.floor(h / 10), h % 10,
    Math.floor(m / 10), m % 10,
    Math.floor(sec / 10), sec % 10,
  ];
}

function toSeconds(d: number[]): number {
  return d[0]*36000 + d[1]*3600 + d[2]*600 + d[3]*60 + d[4]*10 + d[5];
}

function formatDisplay(d: number[]) {
  // index of first nonzero digit, or 5 if all zero
  const firstNonZero = d.findIndex(x => x > 0) ?? 6;

  const digit = (i: number) => (
    <Text key={i} style={i < firstNonZero ? styles.dimDigit : styles.digit}>
      {d[i]}
    </Text>
  );

  return (
    <Text style={styles.display}>
      {digit(0)}{digit(1)}
      <Text style={styles.sep}>:</Text>
      {digit(2)}{digit(3)}
      <Text style={styles.sep}>:</Text>
      {digit(4)}{digit(5)}
    </Text>
  );
}

export default function DurationInput({ value, onChange }: DurationInputProps) {
  const [digits, setDigits] = useState(() => fromSeconds(value));

  const press = (d: number) => {
    setDigits(prev => {
      const next = [...prev.slice(1), d];
      onChange(toSeconds(next));
      return next;
    });
  };

  const back = () => {
    setDigits(prev => {
      const next = [0, ...prev.slice(0, 5)];
      onChange(toSeconds(next));
      return next;
    });
  };

  const keys = [1,2,3,4,5,6,7,8,9,null,0,'⌫'];

  return (
    <View style={styles.container}>
      {formatDisplay(digits)}
      <View style={styles.keypad}>
        {keys.map((k, i) =>
          k === null ? <View key={i} style={styles.key} /> :
          <Pressable key={i} style={styles.key} onPress={() => typeof k === 'number' ? press(k) : back()}>
            <Text style={styles.keyLabel}>{k}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 16 },
  display: { fontSize: 48, fontWeight: 'bold', letterSpacing: 2 },
  digit: { color: '#000' },
  dimDigit: { color: '#ccc' },
  sep: { color: '#ccc' },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', width: 240 },
  key: { width: 80, height: 64, justifyContent: 'center', alignItems: 'center' },
  keyLabel: { fontSize: 24 },
});