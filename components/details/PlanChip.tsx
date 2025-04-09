import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { Plan as AppPlan } from '@/types/enums';
import { StyleSheet, Text, View } from 'react-native';

interface PlanProps {
  name: string;
  limit: number;
  description: string;
}

interface PlanChipProps {
  plan: AppPlan;
  style?: any;
}

const PlanChip = ({ plan, style }: PlanChipProps) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme || 'dark'];

  const planName = plan.name || 'Unnamed Plan';
  const planLimit = plan.limit || 0;
  const planDescription = plan.description || 'No description available';

  return (
    <View
      style={[styles.planChip, { backgroundColor: colors.secondary }, style]}
    >
      <Text style={[styles.planName, { color: colors.textPrimary }]}>
        {planName}
      </Text>
      <Text style={[styles.planLimit, { color: colors.accentPrimary }]}>
        {planLimit} visits/month
      </Text>
      <Text
        style={[styles.planDescription, { color: colors.textSecondary }]}
        numberOfLines={1}
      >
        {planDescription}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  planChip: {
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  planLimit: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
});

export default PlanChip;
