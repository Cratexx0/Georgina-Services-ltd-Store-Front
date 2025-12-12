import React, { useEffect, useMemo, useState } from 'react';
import { Star, Send, Loader2, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import {
  apiService,
  Review as ApiReview,
  CreateReviewRequest,
  ReviewStats,
} from '@/context/ApiService';
import { useAuth } from '@/context/AuthContext';

interface ProductReviewProps {
  productId: string | number;
}

const ProductReview: React.FC<ProductReviewProps> = ({
  productId,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const averageRating = useMemo(() => {
    if (stats?.averageRating) return parseFloat(stats.averageRating) || 0;
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return parseFloat((total / reviews.length).toFixed(1));
  }, [reviews, stats]);

  const totalReviews = stats?.totalReviews ?? reviews.length;

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await apiService.getProductReviews(String(productId), {
        limit: 50,
      });
      setReviews(response.reviews || []);
      setStats(response.stats);
    } catch (error: any) {
      toast.error(error?.message || 'Unable to load reviews right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleStarClick = (rating: number) => {
    setUserRating(rating);
    setShowReviewForm(true);
  };

  const handleSubmitReview = async () => {
    if (userRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!isAuthenticated || !user) {
      toast.error('Please sign in to leave a review.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: CreateReviewRequest = {
        userId: user.id,
        userName: user.fullname || user.name || user.email,
        userEmail: user.email,
        rating: userRating,
        comment: comment.trim() || 'No comment provided',
      };

      await apiService.createReview(String(productId), payload);
      toast.success('Thank you for your review!');

      setUserRating(0);
      setComment('');
      setShowReviewForm(false);
      await fetchReviews();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      const res = await apiService.markReviewHelpful(reviewId);
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                helpfulCount:
                  res.helpfulCount !== undefined
                    ? res.helpfulCount
                    : (review.helpfulCount || 0) + 1,
              }
            : review
        )
      );
      toast.success('Marked as helpful');
    } catch (error: any) {
      toast.error(error?.message || 'Unable to mark as helpful.');
    }
  };

  return (
    <div className="space-y-3">
      {/* Rating Summary & Add Review */}
      <div className="p-3 bg-muted/30 rounded-lg">
        <p className="text-[10px] text-muted-foreground mb-2">Tap a star to rate this product</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`w-5 h-5 cursor-pointer transition-all hover:scale-110 ${
                  index < (hoverRating || Math.round(averageRating))
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-muted-foreground hover:text-amber-300'
                }`}
                onClick={() => handleStarClick(index + 1)}
                onMouseEnter={() => setHoverRating(index + 1)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">
            {averageRating.toFixed(1)} ({totalReviews} reviews)
          </span>
        </div>
      </div>

      {/* Add Review Form */}
      {showReviewForm && (
        <div className="p-3 bg-muted/50 rounded-lg space-y-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">Your rating:</span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-4 h-4 cursor-pointer transition-colors ${
                    index < (hoverRating || userRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-muted-foreground hover:text-amber-300'
                  }`}
                  onClick={() => setUserRating(index + 1)}
                  onMouseEnter={() => setHoverRating(index + 1)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
          </div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this product..."
            className="text-xs min-h-[60px] resize-none"
            disabled={submitting}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSubmitReview}
              className="text-xs h-7"
              disabled={submitting}
            >
              {submitting ? (
                <div className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Sending
                </div>
              ) : (
                <>
                  <Send className="w-3 h-3 mr-1" />
                  Submit
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowReviewForm(false);
                setUserRating(0);
                setComment('');
              }}
              className="text-xs h-7"
              disabled={submitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Recent Reviews */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground">Recent Reviews</h4>
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="w-3 h-3 animate-spin" />
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-xs text-muted-foreground">No reviews yet. Be the first to review.</p>
        ) : (
          reviews.slice(0, 3).map((review) => (
            <div key={review.id} className="p-2 bg-muted/30 rounded-md">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`w-3 h-3 ${
                        index < review.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {apiService.formatReviewDate(review.createdAt || review.updatedAt || new Date().toISOString())}
                </span>
              </div>
              <p className="text-xs text-foreground">{review.comment}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-muted-foreground">
                  — {review.userName || review.userEmail || 'Anonymous'}
                </span>
                <button
                  className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => handleMarkHelpful(review.id)}
                >
                  <ThumbsUp className="w-3 h-3" />
                  Helpful {typeof review.helpfulCount === 'number' ? `(${review.helpfulCount})` : ''}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReview;