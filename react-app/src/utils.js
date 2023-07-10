export function calculateDistance(lat1, lng1, lat2, lng2) {
  const earthRadius = 3958.8; // Radius of the Earth in miles
  const radius = 20; // Hardcoded radius of 20 miles

  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance <= radius;
}

export const calculateNewAverages = (reviews, newReview) => {
  const totalReviews = reviews.length;
  const currentNoiseLevel = reviews.reduce(
    (sum, review) => sum + review.noise_level,
    0
  );
  const currentPetFriendliness = reviews.reduce(
    (sum, review) => sum + review.pet_friendliness,
    0
  );
  const currentWifi = reviews.reduce((sum, review) => sum + review.wifi, 0);

  const newTotalReviews = totalReviews + 1;
  const newNoiseLevel = (
    (currentNoiseLevel + newReview.noise_level) /
    newTotalReviews
  ).toFixed(1);
  const newPetFriendliness = (
    (currentPetFriendliness + newReview.pet_friendliness) /
    newTotalReviews
  ).toFixed(1);
  const newWifi = ((currentWifi + newReview.wifi) / newTotalReviews).toFixed(1);

  return {
    average_noise_level: parseFloat(newNoiseLevel),
    average_pet_friendliness: parseFloat(newPetFriendliness),
    average_wifi: parseFloat(newWifi),
  };
};
