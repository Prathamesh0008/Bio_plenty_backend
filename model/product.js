const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your product name!"],
  },
  description: {
    type: String,
    required: [true, "Please enter your product description!"],
  },

  // product definition

  definition: {
    type: String,
    required: [true, "Please enter your product definition!"],
  },

// structure heading

  structureheading1: {
    type: String,
    required: [true, "Please enter your product structure-heading1!"],
  },
  structureheading2: {
    type: String,
    required: [true, "Please enter your product structure-heading2!"],
  },
  structureheading3: {
    type: String,
    required: [true, "Please enter your product structure-heading3!"],
  },
  structureheading4: {
    type: String,
    required: [true, "Please enter your product structure-heading4!"],
  },
  structureheading5: {
    type: String,
    required: [false, "Please enter your product structure-heading5!"],
  },
  structureheading6: {
    type: String,
    required: [false, "Please enter your product structure-heading5!"],
  },
  structureheading7: {
    type: String,
    required: [false, "Please enter your product structure-heading5!"],
  },
  structureheading8: {
    type: String,
    required: [false, "Please enter your product structure-heading5!"],
  },

// structure data

  structuredata1: {
    type: String,
    required: [true, "Please enter your product structure-heading1!"],
  },
  structuredata2: {
    type: String,
    required: [true, "Please enter your product structure-heading2!"],
  },
  structuredata3: {
    type: String,
    required: [true, "Please enter your product structure-heading3!"],
  },
  structuredata4: {
    type: String,
    required: [true, "Please enter your product structure-heading4!"],
  },
  structuredata5: {
    type: String,
    required: [false, "Please enter your product structure-heading5!"],
  },
  structuredata6: {
    type: String,
    required: [false, "Please enter your product structure-heading6!"],
  },
  structuredata7: {
    type: String,
    required: [false, "Please enter your product structure-heading7!"],
  },
  structuredata8: {
    type: String,
    required: [false, "Please enter your product structure-heading8!"],
  },

  // Research & Effects section Heading

  researchheading: {
    type: String,
    required: [true, "Please enter your product, Research and Effect heading!"],
  },

  researchsubheading1: {
    type: String,
    required: [true, "Please enter your product, Research and Effect heading!"],
  },

  researchsubheading2: {
    type: String,
    required: [true, "Please enter your product, Research and Effect heading!"],
  },

  researchsubheading3: {
    type: String,
    required: [true, "Please enter your product, Research and Effect heading!"],
  },

  researchsubheading4: {
    type: String,
    required: [true, "Please enter your product, Research and Effect heading!"],
  },

  researchsubheading5: {
    type: String,
    required: [false, "Please enter your product, Research and Effect heading!"],
  },

  researchsubheading6: {
    type: String,
    required: [false, "Please enter your product, Research and Effect heading!"],
  },

  researchsubheading7: {
    type: String,
    required: [false, "Please enter your product, Research and Effect heading!"],
  },

  // Research value

  researchvalue1: {
    type: String,
    required: [true, "Please enter your product, Research and Effect definition!"],
  },

  researchvalue2: {
    type: String,
    required: [false, "Please enter your product, Research and Effect definition!"],
  },

  researchvalue3: {
    type: String,
    required: [true, "Please enter your product, Research and Effect definition!"],
  },

  researchvalue4: {
    type: String,
    required: [false, "Please enter your product, Research and Effect definition!"],
  },

  researchvalue5: {
    type: String,
    required: [true, "Please enter your product, Research and Effect definition!"],
  },

  researchvalue6: {
    type: String,
    required: [false, "Please enter your product, Research and Effect definition!"],
  },

  researchvalue7: {
    type: String,
    required: [true, "Please enter your product, Research and Effect definition!"],
  },

  researchvalue8: {
    type: String,
    required: [false, "Please enter your product, Research and Effect definition!"],
  },

  researchvalue9: {
    type: String,
    required: [false, "Please enter your product, Research and Effect definition!"],
  },

  researchvalue10: {
    type: String,
    required: [false, "Please enter your product, Research and Effect definition!"],
  },

  researchvalue11: {
    type: String,
    required: [false, "Please enter your product, Research and Effect definition!"],
  },

  researchvalue12: {
    type: String,
    required: [false, "Please enter your product, Research and Effect definition!"],
  },

  researchvalue13: {
    type: String,
    required: [false, "Please enter your product, Research and Effect definition!"],
  },

  researchvalue14: {
    type: String,
    required: [false, "Please enter your product, Research and Effect definition!"],
  },

  // Future Research products

  researched1: {
    type: String,
    required: [true, "Please enter your product, Researched definition 1!"],
  },

  researched2: {
    type: String,
    required: [true, "Please enter your product, Researched definition 2!"],
  },

// Scientific Journal Author Details

scientificjournalauthor1: {
    type: String,
    required: [true, "Please enter your product, Scientific Journal Author 1!"],
  },

  scientificjournalauthor2: {
    type: String,
    required: [true, "Please enter your product, Scientific Journal Author 2!"],
  },

  // Referenced Citations

  referenceddata1: {
    type: String,
    required: [true, "Please enter your product, referenced data 1!"],
  },

  referenceddata2: {
    type: String,
    required: [true, "Please enter your product, referenced data 2!"],
  },

  referenceddata3: {
    type: String,
    required: [true, "Please enter your product, referenced data 3!"],
  },

  referenceddata4: {
    type: String,
    required: [true, "Please enter your product, referenced data 4!"],
  },

  referenceddata5: {
    type: String,
    required: [true, "Please enter your product, referenced data 5!"],
  },

  referenceddata6: {
    type: String,
    required: [true, "Please enter your product, referenced data 6!"],
  },

  referenceddata7: {
    type: String,
    required: [true, "Please enter your product, referenced data 7!"],
  },

  referenceddata8: {
    type: String,
    required: [true, "Please enter your product, referenced data 8!"],
  },

  referenceddata9: {
    type: String,
    required: [false, "Please enter your product, referenced data 9!"],
  },

  referenceddata10: {
    type: String,
    required: [false, "Please enter your product, referenced data 10!"],
  },

  referenceddata11: {
    type: String,
    required: [false, "Please enter your product, referenced data 11!"],
  },

  referenceddata12: {
    type: String,
    required: [false, "Please enter your product, referenced data 12!"],
  },

  referenceddata1: {
    type: String,
    required: [false, "Please enter your product, referenced data 1!"],
  },

  referenceddata13: {
    type: String,
    required: [false, "Please enter your product, referenced data 13!"],
  },

  referenceddata14: {
    type: String,
    required: [false, "Please enter your product, referenced data 14!"],
  },

  referenceddata15: {
    type: String,
    required: [false, "Please enter your product, referenced data 15!"],
  },

  referenceddata16: {
    type: String,
    required: [false, "Please enter your product, referenced data 16!"],
  },

  referenceddata17: {
    type: String,
    required: [false, "Please enter your product, referenced data 17!"],
  },

  referenceddata18: {
    type: String,
    required: [false, "Please enter your product, referenced data 18!"],
  },


// category

  category: {
    type: String,
    required: [true, "Please enter your product category!"],
  },
  tags: {
    type: String,
  },
  originalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
    required: [true, "Please enter your product price!"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter your product stock!"],
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  structureimages: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  sorcename: {
    type: String,
    required: false,
  },
  sorceaddress: {
    type: String,
    required: false,
  },
  coaimages: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  hplcimages: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  msimages: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  reviews: [
    {
      user: {
        type: Object,
      },
      rating: {
        type: Number,
      },
      comment: {
        type: String,
      },
      productId: {
        type: String,
      },
      createdAt:{
        type: Date,
        default: Date.now(),
      }
    },
  ],
  ratings: {
    type: Number,
  },
  shopId: {
    type: String,
    required: true,
  },
  shop: {
    type: Object,
    required: true,
  },
  sold_out: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
