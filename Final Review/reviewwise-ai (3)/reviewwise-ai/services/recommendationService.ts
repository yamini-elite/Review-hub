
import { Review, UserProfile, Category } from "../types";

export interface RecommendedReview extends Review {
  matchScore: number;
  matchReasons: string[];
}

export const getRecommendations = (reviews: Review[], profile: UserProfile): RecommendedReview[] => {
  if (reviews.length === 0) return [];

  const scored = reviews.map(review => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Category Match (High Priority)
    if (profile.interests.includes(review.category)) {
      score += 40;
      reasons.push(`Matches your interest in ${review.category}`);
    }

    // 2. Rating Quality (Medium Priority)
    if (review.rating >= profile.preferredRatingMin) {
      score += (review.rating * 5);
      reasons.push(`High community rating (${review.rating}/5)`);
    }

    // 3. Keyword/Search History Match (High Priority - Dynamic)
    const recentTerm = profile.searchHistory[profile.searchHistory.length - 1];
    
    profile.searchHistory.forEach(term => {
      const regex = new RegExp(term, 'gi');
      if (regex.test(review.title) || regex.test(review.content)) {
        // Higher weight for matches
        score += 50;
        
        // Recency boost for the very last thing searched
        if (term === recentTerm) {
          score += 30;
          if (!reasons.includes(`Top match for your latest search: "${term}"`)) {
            reasons.push(`Top match for your latest search: "${term}"`);
          }
        } else {
          if (!reasons.includes(`Relates to your search for "${term}"`)) {
            reasons.push(`Relates to your search for "${term}"`);
          }
        }
      }
    });

    return {
      ...review,
      matchScore: score,
      matchReasons: reasons
    };
  });

  // Filter out low scores and sort
  return scored
    .filter(r => r.matchScore > 10)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3); // Top 3 recommendations
};
