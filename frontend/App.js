import React, { useState, useEffect } from 'react';
import AddReview from './AddReview';
import ProductDetails from './ProductDetails';

const App = (props) => {
  const [showAddReview, setShowAddReview] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [productId] = useState('66437a4a1a65ea1c09a35a40'); // Initial product ID
  //const Id = props.id;

  const [airfryerDetails, setAirfryerDetails] = useState(null);
  const [airfryerReviews, setAirfryerReviews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAirfryerDetails(productId);
    fetchAirfryerReviews(productId);
  }, [productId]);

  const API_URL = "http://localhost:5038/";

  const fetchAirfryerDetails = async (productId) => {
    try {
      const response = await fetch(`${API_URL}api/ProductReview/Products?id=${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const products = await response.json();
      const airfryerDetails = products.find(product => product._id === productId);
      setAirfryerDetails(airfryerDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching airfryer details:', error);
      setLoading(false);
    }
  };

  const fetchAirfryerReviews = async (productId) => {
    try {
      const response = await fetch(`${API_URL}api/ProductReview/Reviews?productId=${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const reviews = await response.json();
      setAirfryerReviews(reviews);
      setReviews(reviews); // Update the reviews state with the fetched reviews
      setLoading(false);
    } catch (error) {
      console.error('Error fetching airfryer reviews:', error);
      setLoading(false);
    }
  };
  
  const handleGoToAddReview = () => {
    setShowAddReview(true);
  };

  const handleReviewSubmission = (review) => {
    const updatedReviews = [...reviews, review];
    console.log("New Review:", review);
    console.log("Updated Reviews:", updatedReviews);
    setReviews(updatedReviews);
    setShowAddReview(false);
    setShowProductDetails(true);
  };
  
  return (
    <div className="App">
      {!showAddReview && !showProductDetails && (
        <button onClick={handleGoToAddReview}>Go to Add Review</button>
      )}
      {showAddReview && !showProductDetails && (
        <AddReview onSubmit={handleReviewSubmission} setShowProductDetails={setShowProductDetails} />
      )}
      {showProductDetails && !loading && airfryerDetails && airfryerReviews && (
        <ProductDetails product={airfryerDetails} reviews={reviews} />
      )}
      {loading && <p>Loading...</p>}

    </div>
  );
};

export default App;
