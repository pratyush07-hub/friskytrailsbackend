import {Router} from "express";
import { getBlogBySlug } from "../controllers/admin.controller.js";

const router = Router();

// Add validation middleware for slug parameter
const validateSlug = (req, res, next) => {
  try {
    const { slug } = req.params;
    
    console.log('Blog route accessed with slug:', slug);
    
    // Check if slug exists and is valid
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      console.log('Invalid slug parameter:', slug);
      return res.status(400).json({
        success: false,
        message: "Invalid slug parameter"
      });
    }
    
    // Sanitize slug - remove any potentially problematic characters
    const sanitizedSlug = slug.trim().replace(/[^a-zA-Z0-9-_]/g, '');
    
    if (sanitizedSlug !== slug) {
      console.log('Slug sanitized from:', slug, 'to:', sanitizedSlug);
    }
    
    req.params.slug = sanitizedSlug;
    
    next();
  } catch (error) {
    console.error('Error in validateSlug middleware:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error in slug validation"
    });
  }
};

// Add error handling wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get("/:slug", validateSlug, asyncHandler(getBlogBySlug));

export default router;