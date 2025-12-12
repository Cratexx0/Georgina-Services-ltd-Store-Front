import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';

interface Review {
  id: number;
  rating: number;
  comment: string;
  author: string;
  date: string;
}

interface ProductReviewProps {
  productId: number;
  initialRating?: number;
  initialReviewCount?: number;
}

const ProductReview: React.FC<ProductReviewProps> = ({
  productId,
  initialRating = 4,
  initialReviewCount = 42,
}) => {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      rating: 5,
      comment: 'Excellent quality! Very satisfied with my purchase.',
      author: 'John D.',
      date: '2024-12-10',
    },
    {
      id: 2,
      rating: 4,
      comment: 'Good product, fast delivery. Would recommend.',
      author: 'Sarah M.',
      date: '2024-12-08',
    },
  ]);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleStarClick = (rating: number) => {
    setUserRating(rating);
    setShowReviewForm(true);
  };

  const handleSubmitReview = () => {
    if (userRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    const newReview: Review = {
      id: Date.now(),
      rating: userRating,
      comment: comment.trim() || 'No comment provided',
      author: 'You',
      date: new Date().toISOString().split('T')[0],
    };

    setReviews([newReview, ...reviews]);
    setUserRating(0);
    setComment('');
    setShowReviewForm(false);
    toast.success('Thank you for your review!');
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : initialRating;

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
            {averageRating.toFixed(1)} ({reviews.length + initialReviewCount} reviews)
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
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSubmitReview}
              className="text-xs h-7"
            >
              <Send className="w-3 h-3 mr-1" />
              Submit
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
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Recent Reviews */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground">Recent Reviews</h4>
        {reviews.slice(0, 3).map((review) => (
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
              <span className="text-[10px] text-muted-foreground">{review.date}</span>
            </div>
            <p className="text-xs text-foreground">{review.comment}</p>
            <span className="text-[10px] text-muted-foreground">— {review.author}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReview;