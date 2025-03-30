import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const KNOB_SIZE = 24;
const TIME_TEXT_WIDTH = 45;
const HORIZONTAL_PADDING = 16;
const SLIDER_MARGIN = 8;
const SLIDER_TRACK_WIDTH =
  width -
  2 * HORIZONTAL_PADDING -
  2 * TIME_TEXT_WIDTH -
  2 * SLIDER_MARGIN -
  KNOB_SIZE;

interface TimeRangeSliderProps {
  timeRange: { start: string; end: string };
  onTimeChange: (timeRange: { start: string; end: string }) => void;
  colors: any;
}

export const TimeRangeSlider = ({
  timeRange,
  onTimeChange,
  colors,
}: TimeRangeSliderProps) => {
  const hourToMinutes = (hour: string) => {
    const [hours, minutes] = hour.split(':').map(Number);
    return (hours - 5) * 60 + minutes;
  };

  const minutesToHour = (minutes: number) => {
    const totalMinutes = minutes + 5 * 60;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}`;
  };

  const startMinutes = hourToMinutes(timeRange.start);
  const endMinutes = hourToMinutes(timeRange.end);
  const totalMinutes = (23 - 5) * 60; // 18 hours

  const initialLeftPos = (startMinutes / totalMinutes) * SLIDER_TRACK_WIDTH;
  const initialRightPos = (endMinutes / totalMinutes) * SLIDER_TRACK_WIDTH;

  const leftKnobPosition = useSharedValue(initialLeftPos);
  const rightKnobPosition = useSharedValue(initialRightPos);

  const handleTimeUpdate = (left: number, right: number) => {
    const start = Math.round((left / SLIDER_TRACK_WIDTH) * totalMinutes);
    const end = Math.round((right / SLIDER_TRACK_WIDTH) * totalMinutes);

    const startTime = minutesToHour(Math.max(0, Math.min(start, totalMinutes)));
    const endTime = minutesToHour(Math.max(0, Math.min(end, totalMinutes)));

    onTimeChange({ start: startTime, end: endTime });
  };

  const leftKnobGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: { startX: number }) => {
      ctx.startX = leftKnobPosition.value;
    },
    onActive: (event, ctx) => {
      const newPosition = Math.max(
        0,
        Math.min(rightKnobPosition.value - 20, ctx.startX + event.translationX)
      );
      leftKnobPosition.value = newPosition;
    },
    onEnd: () => {
      leftKnobPosition.value = Math.max(
        0,
        Math.min(leftKnobPosition.value, SLIDER_TRACK_WIDTH)
      );
      runOnJS(handleTimeUpdate)(
        leftKnobPosition.value,
        rightKnobPosition.value
      );
    },
  });

  const rightKnobGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: { startX: number }) => {
      ctx.startX = rightKnobPosition.value;
    },
    onActive: (event, ctx) => {
      const newPosition = Math.min(
        SLIDER_TRACK_WIDTH,
        Math.max(leftKnobPosition.value + 20, ctx.startX + event.translationX)
      );
      rightKnobPosition.value = newPosition;
    },
    onEnd: () => {
      rightKnobPosition.value = Math.min(
        rightKnobPosition.value,
        SLIDER_TRACK_WIDTH
      );
      runOnJS(handleTimeUpdate)(
        leftKnobPosition.value,
        rightKnobPosition.value
      );
    },
  });

  const animatedStyles = {
    leftKnob: useAnimatedStyle(() => ({
      transform: [{ translateX: leftKnobPosition.value }],
    })),
    rightKnob: useAnimatedStyle(() => ({
      transform: [{ translateX: rightKnobPosition.value }],
    })),
    fill: useAnimatedStyle(() => ({
      left: leftKnobPosition.value + KNOB_SIZE / 2,
      right: SLIDER_TRACK_WIDTH - rightKnobPosition.value + KNOB_SIZE / 2,
    })),
  };

  return (
    <View style={styles.timeSelector}>
      <View style={styles.sliderWrapper}>
        <Text style={[styles.timeText, { color: colors.textPrimary }]}>
          {timeRange.start}
        </Text>
        <View style={styles.sliderContainer}>
          <View
            style={[styles.sliderTrack, { backgroundColor: colors.border }]}
          />
          <Animated.View
            style={[
              styles.sliderFill,
              { backgroundColor: colors.accentPrimary },
              animatedStyles.fill,
            ]}
          />
          <PanGestureHandler onGestureEvent={leftKnobGestureHandler}>
            <Animated.View
              style={[
                styles.sliderKnob,
                {
                  backgroundColor: colors.accentPrimary,
                  borderColor: colors.background,
                },
                animatedStyles.leftKnob,
              ]}
            />
          </PanGestureHandler>
          <PanGestureHandler onGestureEvent={rightKnobGestureHandler}>
            <Animated.View
              style={[
                styles.sliderKnob,
                {
                  backgroundColor: colors.accentPrimary,
                  borderColor: colors.background,
                },
                animatedStyles.rightKnob,
              ]}
            />
          </PanGestureHandler>
        </View>
        <Text style={[styles.timeText, { color: colors.textPrimary }]}>
          {timeRange.end}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timeSelector: {
    paddingHorizontal: HORIZONTAL_PADDING,
    marginBottom: 24,
  },
  sliderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 13,
    fontWeight: '500',
    width: TIME_TEXT_WIDTH,
    textAlign: 'center',
    marginHorizontal: 4,
  },
  sliderContainer: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    marginHorizontal: 4,
    position: 'relative',
  },
  sliderTrack: {
    height: 4,
    width: '100%',
    position: 'absolute',
  },
  sliderFill: {
    height: 4,
    position: 'absolute',
  },
  sliderKnob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    borderWidth: 3,
    position: 'absolute',
    top: '50%',
    marginTop: -KNOB_SIZE / 2,
    zIndex: 1,
  },
});
