// app/components/manage/RoutineCollapsedView.tsx
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Routine } from '../types';
import { layout, typography, colors } from '../theme'

interface Props {
  routine: Routine;
  onExpand: () => void;
}

export default function RoutineCollapsedView({ routine, onExpand }: Props) {
  const itemCount = routine.items.length;
  return (
    <Pressable onPress={onExpand}>
      <View>
        <Text>{routine.name}</Text>
        <View>
         <Text>{itemCount} {itemCount === 1 ? 'item' : 'items'}</Text>
         <Text>▶</Text>
        </View>
      </View>
    </Pressable>
  );
}

// RoutineCollapsedView
const styles = StyleSheet.create({
});