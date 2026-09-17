const argon2 = require("argon2");
const { z } = require("zod");

const User = require("../models/User");

const {
  createAccessToken,
  createRefreshToken,
} = require("../services/token.service");

// ========================================
// VALIDATION SCHEMAS
// ========================================

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128),
});

// ========================================
// REGISTER
// ========================================

const register = async (req, res) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration details",
      });
    }

    const {
      name,
      email,
      password,
    } = result.data;

    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Unable to create account",
      });
    }

    const passwordHash = await argon2.hash(password);

    const user = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      role: "student",
      isVerified: true,
      isActive: true,
    });

    // Automatically log the newly registered student in
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    // Store refresh token in secure HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth",
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error(
      "Registration error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// ========================================
// LOGIN
// ========================================

const login = async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid login details",
      });
    }

    const {
      email,
      password,
    } = result.data;

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is disabled",
      });
    }

    const passwordValid =
      await argon2.verify(
        user.passwordHash,
        password
      );

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create authentication tokens
    const accessToken =
      createAccessToken(user);

    const refreshToken =
      createRefreshToken(user);

    // Store refresh token in secure HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// ========================================
// GET CURRENT USER
// ========================================

const getMe = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select(
      "name email role isVerified createdAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Get profile error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// ========================================
// LOGOUT
// ========================================

const logout = async (req, res) => {
  try {
    res.clearCookie(
      "refreshToken",
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(
      "Logout error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// ========================================
// EXPORTS
// ========================================

module.exports = {
  register,
  login,
  getMe,
  logout,
};