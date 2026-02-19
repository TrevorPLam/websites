import { GoogleReviewsAdapter } from '../../google-reviews/src';
import { YelpAdapter } from '../../yelp/src';
import { TrustpilotAdapter } from '../../trustpilot/src';

describe('Review Integrations', () => {
  describe('GoogleReviewsAdapter', () => {
    const adapter = new GoogleReviewsAdapter('place-id');

    it('should have correct id and name', () => {
      expect(adapter.id).toBe('google');
      expect(adapter.name).toBe('Google Reviews');
    });

    it('should return reviews array from getReviews()', async () => {
      const reviews = await adapter.getReviews();
      expect(Array.isArray(reviews)).toBe(true);
    });
  });

  describe('YelpAdapter', () => {
    const adapter = new YelpAdapter('business-id');

    it('should have correct id and name', () => {
      expect(adapter.id).toBe('yelp');
      expect(adapter.name).toBe('Yelp');
    });

    it('should return reviews array from getReviews()', async () => {
      const reviews = await adapter.getReviews();
      expect(Array.isArray(reviews)).toBe(true);
    });
  });

  describe('TrustpilotAdapter', () => {
    const adapter = new TrustpilotAdapter('unit-id');

    it('should have correct id and name', () => {
      expect(adapter.id).toBe('trustpilot');
      expect(adapter.name).toBe('Trustpilot');
    });

    it('should return reviews array from getReviews()', async () => {
      const reviews = await adapter.getReviews();
      expect(Array.isArray(reviews)).toBe(true);
    });
  });
});
