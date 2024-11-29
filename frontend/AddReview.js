import React, { useState, useEffect } from 'react';
import './AddReview.css'; // Import the CSS file for styling

const AddReview = ({ setShowProductDetails, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    product: '',
    rating: '',
    review: ''
  });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5038/api/ProductReview/Category');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };


  const fetchProducts = async (categoryId) => {
    console.log('Category ID to fetch products:', categoryId);
    const categoryIdToFetch = Array.isArray(categoryId) ? categoryId[0] : categoryId;
    console.log('Extracted Category ID to fetch products:', categoryIdToFetch);
    try {
      const response = await fetch(`http://localhost:5038/api/ProductReview/Products?categoryID=${categoryIdToFetch}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      console.log('Fetched products:', data);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
   const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'category') 
        {
            console.log('Selected category:', value); // Log the selected category ID
            setProducts([]); // Clear products state when category changes
            await fetchProducts(value);
        }
    };

// const handleSubmit = async (e) => {
//     console.log('Submitting review with product ID:', formData.product);
//     e.preventDefault();

//     if (formData.rating < 1 || formData.rating > 5) {
//         alert('Rating must be between 1 and 5.');
//         return; // Exit the function early if the rating is invalid
//     }

//     try {
//       const selectedProductId = formData.product; // Capture the selected product ID
//       const reviewData = { ...formData, productID: selectedProductId }; // Add productID to the form data
  
//       const response = await fetch('http://localhost:5038/api/ProductReview/Reviews', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(reviewData) // Send the modified form data with productID included
//       });
  
//       if (response.ok) {
//         setShowProductDetails(true);
//         onSubmit(formData);
//         alert('Review submitted successfully!');
//       } else {
//         throw new Error('HTTP error ' + response.status);
//       }
//     } catch (error) {
//       console.error('Error adding review:', error);
//       alert('Error adding review. Please try again.');
//     }
//   };
    
const handleSubmit = async (e) => {
    console.log('Submitting review with product ID:', formData.product);
    e.preventDefault();
    try {
      const selectedProductId = formData.product; // Capture the selected product ID
      const reviewData = { ...formData, productID: selectedProductId }; // Add productID to the form data
  
      const response = await fetch('http://localhost:5038/api/ProductReview/Reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData) // Send the modified form data with productID included
      });
  
      if (response.ok) {
        setShowProductDetails(true);
        onSubmit(formData, selectedProductId); // Pass the selected product ID to the onSubmit function
        alert('Review submitted successfully!');
      } else {
        throw new Error('HTTP error ' + response.status);
      }
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Error adding review. Please try again.');
    }
  };
  
return (
    <div className="container">
      <h2>Add Review</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>{category.categoryname}</option>
            ))}
          </select>
        </div>
        {formData.category && ( // Only render products dropdown when category is selected
          <div className="form-group">
            <label>Product:</label>
            <select name="product" value={formData.product} onChange={handleChange}>
            <option value="">Select Product</option>
            {products
                .filter(product => product.categoryID.includes(formData.category)) // Filter products based on category
                .map(product => (
                <option key={product._id} value={product._id}>{product.productname}</option>
                ))}
            </select>

          </div>
        )}
        <div className="form-group">
          <label>Rating:</label>
          <input type="number" name="rating" value={formData.rating} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Review:</label>
          <textarea name="review" value={formData.review} onChange={handleChange} />
        </div>
        <div className= "submitbutton">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default AddReview;
