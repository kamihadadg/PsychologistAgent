const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Web3 = require('web3');
const db = require('../config/db');
const { OAuth2Client } = require('google-auth-library');


// روش احراز هویت معمولی - ورود کاربر
exports.login = async (req, res) => {
  try {
    const { username, userpass } = req.body;

    // بررسی وجود نام کاربری و رمز عبور
    if (!username || !userpass) {
      return res.status(400).json({
        success: false,
        message: 'نام کاربری و رمز عبور الزامی است'
      });
    }

    // جستجوی کاربر در دیتابیس
    const userQuery = await db.query(
      'SELECT * FROM dimuser WHERE email = $1 OR username = $1',
      [username]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'کاربری با این مشخصات یافت نشد'
      });
    }

    const user = userQuery.rows[0];

    // مقایسه رمز عبور
    const isPasswordValid = await bcrypt.compare(userpass, user.userpass);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'رمز عبور اشتباه است'
      });
    }

    // ایجاد توکن JWT
    const authToken = jwt.sign(
      { id: user.userid, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );

    // ارسال اطلاعات کاربر و توکن
    return res.status(200).json({
      success: true,
      message: 'ورود موفقیت‌آمیز',
      data: {
        id: user.userid,
        username: user.username,
        email: user.email,
        profileImage: user.profile_image,
        token: authToken
      }
    });

  } catch (error) {
    console.error('خطا در ورود:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در سرور',
      error: error.message
    });
  }
};

// روش احراز هویت معمولی - ثبت‌نام کاربر
exports.register = async (req, res) => {
  try {
    const { name, username, userpass, email } = req.body;

    // بررسی وجود تمام فیلدهای ضروری
    if (!username || !userpass || !email) {
      return res.status(400).json({
        success: false,
        message: 'تمام فیلدها الزامی هستند'
      });
    }

    // بررسی وجود کاربر با همین ایمیل یا نام کاربری
    const existingUserQuery = await db.query(
      'SELECT * FROM dimuser WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUserQuery.rows.length > 0) {
      const user = existingUserQuery.rows[0];
      if (user.email === email) {
        return res.status(409).json({
          success: false,
          message: 'این آدرس ایمیل قبلاً ثبت شده است'
        });
      } else {
        return res.status(409).json({
          success: false,
          message: 'این نام کاربری قبلاً استفاده شده است'
        });
      }
    }

    // رمزنگاری رمز عبور
    const hashedPassword = await bcrypt.hash(userpass, 10);

    // ایجاد کاربر جدید
    const newUserQuery = await db.query(
      `INSERT INTO dimuser 
       (username, userpass, email, auth_method) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [username, hashedPassword, email, 'local']
    );

    const newUser = newUserQuery.rows[0];

    return res.status(201).json({
      success: true,
      message: 'ثبت‌نام با موفقیت انجام شد',
      data: {
        id: newUser.userid,
        username: newUser.username,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error('خطا در ثبت‌نام:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در سرور',
      error: error.message
    });
  }
};

// Add this method to handle Google Authentication
exports.googleAuth = async (req, res) => {
  try {
    const { token: idToken, isRegistration } = req.body;

    // Validate input
    if (!idToken || typeof isRegistration === 'undefined') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request: token and isRegistration are required',
      });
    }

    // Verify Google ID token
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    const userQuery = await db.query('SELECT * FROM dimuser WHERE email = $1', [email]);
    let user = userQuery.rows[0];

    if (!user && !isRegistration) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.',
      });
    }

    if (!user) {
      // Create new user
      const username = name || email.split('@')[0];
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      const newUserQuery = await db.query(
        `INSERT INTO dimuser 
         (username, userpass, email, auth_method, google_id, profile_image)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [username, hashedPassword, email, 'google', googleId, picture]
      );
      user = newUserQuery.rows[0];
    } else if (user.auth_method !== 'google') {
      // Link existing account
      await db.query(
        `UPDATE dimuser 
         SET google_id = $1, auth_method = $2, profile_image = COALESCE(profile_image, $3)
         WHERE userid = $4`,
        [googleId, 'google', picture, user.userid]
      );

      const updatedUserQuery = await db.query('SELECT * FROM dimuser WHERE userid = $1', [
        user.userid,
      ]);
      user = updatedUserQuery.rows[0];
    }

    // Generate JWT
    const authToken = jwt.sign(
      { id: user.userid, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      message: isRegistration ? 'Registration successful' : 'Login successful',
      data: {
        id: user.userid,
        email: user.email,
        username: user.username,
        profileImage: user.profile_image,
        token: authToken,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error.stack);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Add this method to handle MetaMask nonce generation
exports.getMetaMaskNonce = async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Address is required'
      });
    }
    
    // PostgreSQL query to find user with this wallet address
    const userQuery = await db.query(
      'SELECT * FROM dimuser WHERE wallet_address = $1',
      [address]
    );
    
    // Generate a random nonce
    const nonce = Math.floor(Math.random() * 1000000).toString();
    
    if (userQuery.rows.length > 0) {
      // Update the nonce for existing user
      await db.query(
        'UPDATE dimuser SET wallet_nonce = $1 WHERE wallet_address = $2',
        [nonce, address]
      );
    } else {
      // Store the nonce temporarily for new users
      // In a production environment, this should be stored in Redis or another temporary storage
      if (!global.pendingWalletNonces) {
        global.pendingWalletNonces = {};
      }
      global.pendingWalletNonces[address] = nonce;
    }
    
    return res.status(200).json({
      success: true,
      nonce
    });
    
  } catch (error) {
    console.error('MetaMask nonce error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate nonce',
      error: error.message
    });
  }
};

// Add this method to handle MetaMask Authentication
exports.metamaskAuth = async (req, res) => {
  try {
    const { address, signature, message, isRegistration } = req.body;
    
    if (!address || !signature || !message) {
      return res.status(400).json({
        success: false,
        message: 'Address, signature, and message are required'
      });
    }
    
    // Verify the signature
    const web3 = new Web3();
    const recoveredAddress = web3.eth.accounts.recover(message, signature);
    
    // Check if the recovered address matches the claimed address
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({
        success: false,
        message: 'Invalid signature'
      });
    }
    
    // Extract nonce from message
    const nonceMatch = message.match(/nonce: (\d+)/);
    if (!nonceMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message format'
      });
    }
    const nonce = nonceMatch[1];
    
    // Find existing user using PostgreSQL
    const userQuery = await db.query(
      'SELECT * FROM dimuser WHERE wallet_address = $1',
      [address]
    );
    
    let user = userQuery.rows[0];
    
    if (!user) {
      if (!isRegistration) {
        return res.status(404).json({
          success: false,
          message: 'User not found. Please register first.'
        });
      }
      
      // For new users, check against temporarily stored nonces
      if (!global.pendingWalletNonces || 
          global.pendingWalletNonces[address] !== nonce) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired nonce'
        });
      }
      
      // Create a new user
      const username = `user_${address.substring(0, 8)}`;
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      const newNonce = Math.floor(Math.random() * 1000000).toString();
      
      // Insert new user to PostgreSQL
      const newUserQuery = await db.query(
        `INSERT INTO dimuser 
         (username, userpass, email, auth_method, wallet_address, wallet_nonce)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          username, 
          hashedPassword, 
          `${username}@placeholder.com`, // Placeholder email
          'metamask',
          address,
          newNonce
        ]
      );
      
      user = newUserQuery.rows[0];
      
      // Clean up the temporary nonce
      delete global.pendingWalletNonces[address];
      
    } else {
      // For existing users, verify the nonce stored in their profile
      if (user.wallet_nonce !== nonce) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired nonce'
        });
      }
      
      // Update the nonce for future logins
      const newNonce = Math.floor(Math.random() * 1000000).toString();
      await db.query(
        'UPDATE dimuser SET wallet_nonce = $1 WHERE wallet_address = $2',
        [newNonce, address]
      );
      
      user.wallet_nonce = newNonce;
    }
    
    // Generate JWT token
    const authToken = jwt.sign(
      { id: user.userid, walletAddress: user.wallet_address },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
    
    // Return user data and token
    return res.status(200).json({
      success: true,
      message: isRegistration ? 'Registration successful' : 'Login successful',
      data: {
        id: user.userid,
        username: user.username,
        walletAddress: user.wallet_address,
        token: authToken
      }
    });
    
  } catch (error) {
    console.error('MetaMask auth error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
}; 