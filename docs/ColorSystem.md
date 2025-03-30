# Dabbler App Color System

This document explains the color system used in the Dabbler mobile application and how it's implemented.

## Color Palette Overview

### Theme Colors

#### Light Theme
- **Background**: `hsl(0 0% 100%)` - Pure white
- **Foreground**: `hsl(222.2 84% 4.9%)` - Dark blue-gray for text
- **Card Background**: `hsl(0 0% 100%)` - White
- **Card Foreground**: `hsl(222.2 84% 4.9%)` - Dark blue-gray
- **Primary**: `hsl(217 91.2% 59.8%)` - Bright blue (#3B82F6)
- **Primary Foreground**: `hsl(0 0% 100%)` - White
- **Secondary**: `hsl(210 40% 96.1%)` - Light blue-gray
- **Secondary Foreground**: `hsl(222.2 47.4% 11.2%)` - Dark blue-gray
- **Muted**: `hsl(210 40% 96.1%)` - Light blue-gray
- **Muted Foreground**: `hsl(215.4 16.3% 46.9%)` - Medium blue-gray
- **Border**: `hsl(214.3 31.8% 91.4%)` - Light gray with blue tint
- **Input**: `hsl(214.3 31.8% 91.4%)` - Light gray with blue tint
- **Map Background**: `#e5f9f0` - Light mint green

#### Dark Theme
- **Background**: `hsl(222.2 84% 4.9%)` - Dark blue-gray
- **Foreground**: `hsl(210 40% 98%)` - Off-white
- **Card Background**: `hsl(222.2 84% 4.9%)` - Dark blue-gray
- **Card Foreground**: `hsl(210 40% 98%)` - Off-white
- **Primary**: `hsl(217 91.2% 59.8%)` - Bright blue (#3B82F6)
- **Primary Foreground**: `hsl(0 0% 100%)` - White
- **Secondary**: `hsl(217.2 32.6% 17.5%)` - Dark blue-gray
- **Secondary Foreground**: `hsl(210 40% 98%)` - Off-white
- **Muted**: `hsl(217.2 32.6% 17.5%)` - Dark blue-gray
- **Muted Foreground**: `hsl(215 20.2% 65.1%)` - Medium gray with blue tint
- **Border**: `hsl(217.2 32.6% 17.5%)` - Dark blue-gray
- **Input**: `hsl(217.2 32.6% 17.5%)` - Dark blue-gray
- **Map Background**: `#0f1b29` - Dark navy blue

### Venue Type Colors
- **Gym**: `#FF5757` - Bright red
- **Pool**: `#A173FF` - Purple
- **Restaurant**: `#FF9C40` - Orange
- **Store**: `#40A1FF` - Blue
- **Default**: `#40A1FF` - Blue

### Marker/Cluster Colors
- **Cluster Background**: `#000000` - Black
- **Cluster Text**: `#FFFFFF` - White
- **Cluster Border**: `#FFFFFF` - White
- **Marker Stroke**: `#FFFFFF` - White

## Implementation

The color system is implemented across three main files:

1. **`constants/Colors.ts`** - Main color definitions for light and dark themes
2. **`constants/VenueColors.ts`** - Specific colors for venue types and markers
3. **`constants/MapColors.ts`** - Map styling for light and dark themes

### Usage Guidelines

1. **Text Colors**:
   - For primary text, use `colors.textPrimary`
   - For secondary text (like descriptions), use `colors.textSecondary`
   - For tertiary text (like hints), use `colors.textTertiary`

2. **Background Colors**:
   - For screens, use `colors.background`
   - For cards or elevated containers, use `colors.cardBackground` or `colors.secondary`

3. **Accent Colors**:
   - For primary actions and highlights, use `colors.accentPrimary`
   - For secondary actions, use `colors.accentSecondary`

4. **Venue Type Colors**:
   - Import from `constants/VenueColors.ts`
   - Use the appropriate color based on venue type

## Examples

### Styling a component with theme colors:

```jsx
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';

export const MyComponent = () => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.textPrimary }}>Primary Text</Text>
      <Text style={{ color: colors.textSecondary }}>Secondary Text</Text>
      <TouchableOpacity 
        style={{ backgroundColor: colors.accentPrimary }}
      >
        <Text style={{ color: colors.textPrimary }}>Button</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### Using venue type colors:

```jsx
import { VENUE_COLORS } from '@/constants/VenueColors';

const getVenueColor = (venueType) => {
  switch(venueType) {
    case 'GYM': return VENUE_COLORS.GYM;
    case 'POOL': return VENUE_COLORS.POOL;
    case 'RESTAURANT': return VENUE_COLORS.RESTAURANT;
    case 'STORE': return VENUE_COLORS.STORE;
    default: return VENUE_COLORS.DEFAULT;
  }
};
``` 