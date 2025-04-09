import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

interface StarRatingProps {
  rating?: number;
  size?: number;
  style?: any;
}

const StarRating = ({ rating = 0, size = 16, style = {} }: StarRatingProps) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons
          key={`star-${i}`}
          name="star"
          size={size}
          color="#FFC700"
          style={{ marginRight: 2 }}
        />
      );
    }

    if (halfStar) {
      stars.push(
        <Ionicons
          key="star-half"
          name="star-half"
          size={size}
          color="#FFC700"
          style={{ marginRight: 2 }}
        />
      );
    }

    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={`star-empty-${i}`}
          name="star-outline"
          size={size}
          color="#FFC700"
          style={{ marginRight: 2 }}
        />
      );
    }

    return stars;
  };

  return <View style={[{ flexDirection: 'row' }, style]}>{renderStars()}</View>;
};

export default StarRating;
