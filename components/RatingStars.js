import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming FontAwesome is used

const RatingStars = ({ rate }) => {
  const fullStars = Math.floor(rate);
  const halfStar = rate - fullStars >= 0.5 ? 1 : 0;
  const stars = Array.from({ length: fullStars }, (_, index) => (
    <Icon key={index} name="star" size={16} color="#FFD700" />
  )).concat(
    halfStar === 1 ? <Icon key="half-star" name="star-half" size={14} color="#FFD700" /> : null
  );
  return stars;
};

export default RatingStars;