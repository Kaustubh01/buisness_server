const Business = require('../models/Business');
const User = require('../models/user');
const Inventory = require('../models/Inventory');

exports.createBusiness = async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user.id; 
  
    try {
      const business = new Business({
        name,
        description,
        owner: userId,
      });
      await business.save();
  
      res.status(201).json({ message: 'Business created successfully', business });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.inviteEmployee = async (req, res) => {
    const { businessId, email } = req.body;

    if (!businessId) {
        return res.status(400).json({ error: 'Business ID are required' });
    }
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Find the business
        const business = await Business.findById(businessId);
        if (!business) {
            return res.status(404).json({ error: 'Business not found' });
        }

        // // Check if the authenticated user is the owner of the business
        // const currentUser = await User.findById(req.user.id);
        // if (!currentUser || business.owner.toString() !== currentUser._id.toString()) {
        //     return res.status(403).json({ error: 'Not authorized to invite employees to this business' });
        // }

        // Find the user to invite by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if(user.role === 'owner') {
            return res.status(400).json({ error: 'Cannot invite business owner' });
        }

        // Add request to the business
        business.pendingRequests.push({ email });
        await business.save();

        // Add business request to the user
        user.businessRequests.push({ businessId: business._id, businessName: business.name });
        await user.save();

        res.status(200).json({ message: 'Invitation sent successfully' });
    } catch (error) {
        console.error('Error inviting employee:', error); // Log detailed error
        res.status(500).json({ error: 'An error occurred while inviting the employee' });
    }
};

  
// Accept Request
exports.acceptRequest = async (req, res) => {
  const { businessId } = req.body;
  const userId = req.user.id;

  try {
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Add employee to the business
    business.employees.push(userId);
    const currUser = await User.findById(userId);
    // Remove the request from pendingRequests
    business.pendingRequests = business.pendingRequests.filter(req => req.email !== req.currUser.email);

    // Save the updated business document
    await business.save();

    // Remove the business request from the user's businessRequests
    const user = await User.findById(userId);
    user.businessRequests = user.businessRequests.filter(req => req.businessId.toString() !== businessId);
    await user.save();

    res.status(200).json({ message: 'Request accepted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reject Request
exports.rejectRequest = async (req, res) => {
  const { businessId } = req.body;
  const userId = req.user.id;

  try {
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Remove the request from pendingRequests
    business.pendingRequests = business.pendingRequests.filter(req => req.email !== req.user.email);

    // Save the updated business document
    await business.save();

    // Remove the business request from the user's businessRequests
    const user = await User.findById(userId);
    user.businessRequests = user.businessRequests.filter(req => req.businessId.toString() !== businessId);
    await user.save();

    res.status(200).json({ message: 'Request rejected successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.showBusinesses = async (req, res) => {
    const userId = req.user.id; 
  
    try {
      const businesses = await Business.find({ $or: [{ owner: userId }, { employees: userId }] });
      res.status(200).json({ businesses });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.showBuisnessforEmployee = async (req, res) => {
    const userId = req.user.id;

    try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      if(user.role === 'owner') {
          return res.status(400).json({ error: 'Owner cannot be an employee' });
      }
      if(user.businessAssociated.length === 0) {
          return res.status(404).json({ error: 'User is not associated with any business' });
      }

      
      return res.status(200).json({ user: user.businessAssociated });
    }
    catch (error) {
      res.status(500).json({ error: error.message });
    } 
  }






  


  // Add a new product to the inventory
  exports.addProduct = async (req, res) => {
    const {businessId} = req.params;
    const { productName, productDescription, quantity, price } = req.body;
  
    try {
      const product = new Inventory({
        
        productName,
        productDescription,
        quantity,
        price,
      });

      if(!businessId) {
        return res.status(400).json({ error: 'Business ID is required' });
      }

      if(!productName) {
        return res.status(400).json({ error: 'Product Name is required' });
      }

      if(!productDescription) {
        return res.status(400).json({ error: 'Product Description is required' });
      }

      if(!quantity) {
        return res.status(400).json({ error: 'Quantity is required' });
      }

      if(!price) {
        return res.status(400).json({ error: 'Price is required' });
      }

      const business = await Business.findById(businessId);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      business.inventory.push(product);
      await business.save();

      await product.save();
      res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Update product details (e.g., quantity or price)
  exports.updateProduct = async (req, res) => {
    const { productId, businessId } = req.params; // assuming productId is passed as a route parameter
    const { productName, productDescription, quantity, price, unitsSold } = req.body;
  
    try {
      if(!businessId) {
        return res.status(400).json({ error: 'Business ID is required' });
      }

      const business = await Business.findById(businessId);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      if(business.inventory.indexOf(productId) === -1) {
        return res.status(404).json({ error: 'Product not found in the business inventory' });
      }

      const product = await Inventory.findOne({ productId });
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      if (productName) product.productName = productName;
      if (productDescription) product.productDescription = productDescription;
      if (quantity !== undefined) product.quantity = quantity;
      if (price !== undefined) product.price = price;
      if (unitsSold !== undefined) product.unitsSold = unitsSold;
  
      await product.save();
      res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Remove a product from the inventory
  exports.removeProduct = async (req, res) => {
    const { productId, businessId } = req.params; // assuming productId is passed as a route parameter
  
    try {
      if(!businessId) {
        return res.status(400).json({ error: 'Business ID is required' });
      }

      const business = await Business.findById(businessId);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      if(business.inventory.indexOf(productId) === -1) {
        return res.status(404).json({ error: 'Product not found in the business inventory' });
      }

      const product = await Inventory.findOneAndDelete({ productId });
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      business.inventory = business.inventory.filter(item => item.productId !== productId);
      await business.save();


      res.status(200).json({ message: 'Product removed successfully', product });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // View all products in the inventory
  exports.viewInventory = async (req, res) => {
    const { businessId } = req.params; // Assuming businessId is passed as a route parameter
  
    try {
      // Check if businessId is provided
      if (!businessId) {
        return res.status(400).json({ error: 'Business ID is required' });
      }
  
      // Find the business by ID
      const business = await Business.findById(businessId).populate('inventory'); // Populate the inventory field if it's a reference
  
      // Check if the business exists
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }
  
      // Get the inventory products
      const products = business.inventory || [];
  
      return res.status(200).json({ products });
    } catch (error) {
      // Handle unexpected errors
      return res.status(500).json({ error: 'An error occurred while retrieving inventory', details: error.message });
    }
  };
  
  // View details of a specific product by productId
exports.viewProduct = async (req, res) => {
  const { productId, businessId } = req.params; // Assuming productId and businessId are passed as route parameters

  try {
    // Check if businessId and productId are provided
    if (!businessId) {
      return res.status(400).json({ error: 'Business ID is required' });
    }
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Find the business by ID
    const business = await Business.findById(businessId).populate('inventory'); // Populate inventory if it's a reference

    // Check if the business exists
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Find the specific product in the inventory
    const product = business.inventory.find(item => item._id.toString() === productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ error: 'Product not found in the business inventory' });
    }

    // Return the product details
    return res.status(200).json({ product });
  } catch (error) {
    // Handle unexpected errors
    return res.status(500).json({ error: 'An error occurred while retrieving the product', details: error.message });
  }
};

  