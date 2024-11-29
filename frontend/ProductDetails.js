import React from 'react';
import './ProductDetails.css'; // Import the ProductDetails.css file for styling

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push(<span key={i} className="star">&#9733;</span>);
  }
  return (
    <div>
      {stars}
    </div>
  );
};

const ProductDetails = ({ product, reviews }) => {
  return (
    <div className="productdetail">
      <div className="container">
        <div className="left-panel">
          <div className="product-image">
            <img src={product.image} alt={product.productname} /> {/* Use the image URL from the product */}
          </div>
        </div>
        <div className="right-panel">
          <div className="product-description">
            <h3>{product.productname}</h3>
            <p>Price: {product.price}</p>
            <p>Description: {product.description}</p>
            <p>Brand: {product.brand}</p>
            <h4>Reviews:</h4>
            {reviews && reviews.map((review, index) => (
              <div key={index} className="review-card">
                <StarRating rating={review.rating} />
                <p>Name: {review.name}</p>
                <p>Review: {review.review}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
