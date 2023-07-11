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

export const calculateNewAverages = (
  reviews,
  updatedReview = null,
  deletedReviewId = null
) => {
  let totalReviews = reviews.length;
  let sumNoiseLevel = 0;
  let sumPetFriendliness = 0;
  let sumWifi = 0;

  if (updatedReview) {
    // Review is added or edited
    reviews = reviews.map((review) => {
      if (review.id === updatedReview.id) {
        // Update the existing review
        return updatedReview;
      }
      return review;
    });
  } else if (deletedReviewId) {
    // Review is deleted
    reviews = reviews.filter((review) => review.id !== deletedReviewId);
  }

  // Calculate the sums of the different properties
  for (const review of reviews) {
    sumNoiseLevel += review.noise_level;
    sumPetFriendliness += review.pet_friendliness;
    sumWifi += review.wifi;
  }

  // Calculate the new averages
  const averageNoiseLevel =
    totalReviews > 0 ? (sumNoiseLevel / totalReviews).toFixed(1) : 0;
  const averagePetFriendliness =
    totalReviews > 0 ? (sumPetFriendliness / totalReviews).toFixed(1) : 0;
  const averageWifi =
    totalReviews > 0 ? (sumWifi / totalReviews).toFixed(1) : 0;

  return {
    average_noise_level: parseFloat(averageNoiseLevel),
    average_pet_friendliness: parseFloat(averagePetFriendliness),
    average_wifi: parseFloat(averageWifi),
  };
};
