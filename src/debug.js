// Quick debug script to test API connection
// Run this in browser console on your app to debug

// eslint-disable-next-line no-unused-vars
async function debugCheckout() {
  try {
    console.log('Testing API connection...');
    
    // Test basic connection
    const healthCheck = await fetch('http://localhost:5000/api/products', {
      credentials: 'include'
    });
    console.log('Products API status:', healthCheck.status);
    
    if (healthCheck.ok) {
      const products = await healthCheck.json();
      console.log('Available products:', products.length);
      
      // Find the EVGA power supply
      const evgaPowerSupply = products.find(p => 
        p.name.includes('EVGA') && p.category === 'power'
      );
      
      if (evgaPowerSupply) {
        console.log('EVGA Power Supply found:', evgaPowerSupply);
        console.log('Current stock:', evgaPowerSupply.quantity);
        
        // Test stock update
        console.log('Testing stock update...');
        const stockUpdate = await fetch(`http://localhost:5000/api/products/stock/${evgaPowerSupply._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ quantityPurchased: 1 })
        });
        
        console.log('Stock update status:', stockUpdate.status);
        
        if (!stockUpdate.ok) {
          const errorData = await stockUpdate.text();
          console.log('Stock update error:', errorData);
        } else {
          const result = await stockUpdate.json();
          console.log('Stock update success:', result);
        }
      } else {
        console.log('EVGA Power Supply not found in products');
      }
    }
  } catch (error) {
    console.error('Debug failed:', error);
  }
}

// Check if user is logged in
function checkAuthStatus() {
  const cookies = document.cookie.split(';').map(c => c.trim());
  const tokenCookie = cookies.find(c => c.startsWith('token='));
  console.log('Auth cookie found:', !!tokenCookie);
  if (tokenCookie) {
    console.log('Token cookie:', tokenCookie.substring(0, 20) + '...');
  }
}

console.log('Debug functions loaded. Run:');
console.log('- checkAuthStatus() to check if logged in');
console.log('- debugCheckout() to test the checkout process');

checkAuthStatus();
