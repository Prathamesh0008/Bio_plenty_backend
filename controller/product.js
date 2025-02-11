const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Order = require("../model/order");
const Shop = require("../model/shop");
const Contact = require("../model/Contact");
const { upload } = require("../multer");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
const LatestData = require("../model/Latestdata");
const { ObjectId } = require("mongoose").Types;

// Create product
router.post(
  "/create-product",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;

      // Validate Shop ID
      if (!ObjectId.isValid(shopId)) {
        return next(new ErrorHandler("Shop ID is invalid!", 400));
      }

      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop not found with this ID!", 400));
      }

      let images = [];
      if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else {
        images = req.body.images;
      }

      const imagesLinks = [];
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      // structureimages images
      let structureimages = [];
      if (typeof req.body.structureimages === "string") {
        structureimages.push(req.body.structureimages);
      } else {
        structureimages = req.body.structureimages;
      }

      const structureimagesLinks = [];
      for (let i = 0; i < structureimages.length; i++) {
        const result = await cloudinary.v2.uploader.upload(structureimages[i], {
          folder: "products",
        });
        structureimagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      // Coa Images
      let coaimages = [];
      if (typeof req.body.coaimages === "string") {
        coaimages.push(req.body.coaimages);
      } else {
        coaimages = req.body.coaimages;
      }

      const coaimagesLinks = [];
      for (let i = 0; i < coaimages.length; i++) {
        const result = await cloudinary.v2.uploader.upload(coaimages[i], {
          folder: "certificate",
        });
        coaimagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      // hplc images
      let hplcimages = [];
      if (typeof req.body.hplcimages === "string") {
        hplcimages.push(req.body.hplcimages);
      } else {
        hplcimages = req.body.hplcimages;
      }

      const hplcimagesLinks = [];
      for (let i = 0; i < hplcimages.length; i++) {
        const result = await cloudinary.v2.uploader.upload(hplcimages[i], {
          folder: "certificate",
        });
        hplcimagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      // msimages
      let msimages = [];
      if (typeof req.body.msimages === "string") {
        msimages.push(req.body.msimages);
      } else {
        msimages = req.body.msimages;
      }

      const msimagesLinks = [];
      for (let i = 0; i < msimages.length; i++) {
        const result = await cloudinary.v2.uploader.upload(msimages[i], {
          folder: "certificate",
        });
        msimagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      const productData = req.body;
      productData.images = imagesLinks;
      productData.structureimages = structureimagesLinks;
      productData.coaimages = coaimagesLinks;
      productData.hplcimages = hplcimagesLinks;
      productData.msimages = msimagesLinks;
      productData.shop = shop;

      const product = await Product.create(productData);

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);


// Single Product fetching data
router.get(
  "/get-single-products/:id",
  catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    try {
      const singleproduct = await Product.findById(id);

      if (!singleproduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.status(200).json({
        success: true,
        singleproduct,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update product
router.put(
  "/update-product/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;

      // Validate Product ID
      if (!ObjectId.isValid(productId)) {
        return next(new ErrorHandler("Product ID is invalid!", 400));
      }

      const product = await Product.findById(productId);
      if (!product) {
        return next(new ErrorHandler("Product not found with this ID!", 400));
      }

      let images = [];
      if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else {
        images = req.body.images;
      }

      const imagesLinks = [];
      for (let i = 0; i < images?.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      // structureimages images
      let structureimages = [];
      if (typeof req.body.structureimages === "string") {
        structureimages.push(req.body.structureimages);
      } else {
        structureimages = req.body.structureimages;
      }

      const structureimagesLinks = [];
      for (let i = 0; i < structureimages?.length; i++) {
        const result = await cloudinary.v2.uploader.upload(structureimages[i], {
          folder: "products",
        });
        structureimagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      // Coa Images
      let coaimages = [];
      if (typeof req.body.coaimages === "string") {
        coaimages.push(req.body.coaimages);
      } else {
        coaimages = req.body.coaimages;
      }

      const coaimagesLinks = [];
      for (let i = 0; i < coaimages?.length; i++) {
        const result = await cloudinary.v2.uploader.upload(coaimages[i], {
          folder: "certificate",
        });
        coaimagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      // hplc images
      let hplcimages = [];
      if (typeof req.body.hplcimages === "string") {
        hplcimages.push(req.body.hplcimages);
      } else {
        hplcimages = req.body.hplcimages;
      }

      const hplcimagesLinks = [];
      for (let i = 0; i < hplcimages?.length; i++) {
        const result = await cloudinary.v2.uploader.upload(hplcimages[i], {
          folder: "certificate",
        });
        hplcimagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      // msimages
      let msimages = [];
      if (typeof req.body.msimages === "string") {
        msimages.push(req.body.msimages);
      } else {
        msimages = req.body.msimages;
      }

      const msimagesLinks = [];
      for (let i = 0; i < msimages?.length; i++) {
        const result = await cloudinary.v2.uploader.upload(msimages[i], {
          folder: "certificate",
        });
        msimagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      const productData = req.body;
      productData.images = imagesLinks;
      productData.structureimages = structureimagesLinks;
      productData.coaimages = coaimagesLinks;
      productData.hplcimages = hplcimagesLinks;
      productData.msimages = msimagesLinks;

      const updatedProduct = await Product.findByIdAndUpdate(productId, productData, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        success: true,
        updatedProduct,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Get all products of a shop
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return next(new ErrorHandler("Shop ID is invalid!", 400));
      }

      const products = await Product.find({ shopId: req.params.id });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Delete product of a shop
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return next(new ErrorHandler("Product ID is invalid!", 400));
      }

      const product = await Product.findById(req.params.id);
      if (!product) {
        return next(new ErrorHandler("Product not found with this ID", 404));
      }

      // Delete images from Cloudinary
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }

      // Delete the product
      await Product.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Product deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Get all products
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Review for a product
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;

      // Validate IDs
      if (!ObjectId.isValid(productId) || !ObjectId.isValid(orderId)) {
        return next(new ErrorHandler("Invalid Product or Order ID!", 400));
      }

      const product = await Product.findById(productId);

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      const isReviewed = product.reviews.find(
        (rev) => rev.user._id.toString() === req.user._id.toString()
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id.toString() === req.user._id.toString()) {
            rev.rating = rating;
            rev.comment = comment;
            rev.user = user;
          }
        });
      } else {
        product.reviews.push(review);
      }

      let avg = 0;
      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });
      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: "Reviewed successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// All products for admin
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// All products for admin
router.get(
  "/admin-all-contactdata",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const contactdata = await Contact.find();

      res.status(200).json({
        success: true,
        contactdata,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Deleting logic for the contact us data

router.delete(
  "/delete-contact/:id",
  // isAuthenticated,
  // isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const contact = await Contact.findById(req.params.id);

      if (!contact) {
        return next(
          new ErrorHandler("Contact is not available with this id", 400)
        );
      }

      await Contact.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Contact deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// All products for admin
router.get(
  "/admin-all-latestdata",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const LatestDatas = await LatestData.find();

      res.status(200).json({
        success: true,
        LatestDatas,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Deleting logic for the contact us data

router.delete(
  "/delete-offerupdate/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const LatestDatas = await LatestData.findById(req.params.id);

      if (!LatestDatas) {
        return next(
          new ErrorHandler("Contact is not available with this id", 400)
        );
      }

      await LatestData.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Offer updating deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
