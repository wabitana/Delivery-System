const Joi = require("joi");

const register = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
  full_name: Joi.string().min(2).max(255).required(),
  phone: Joi.string().max(32).allow("", null),
  role: Joi.string().valid("customer", "vendor", "delivery").default("customer")
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const vendorCreate = Joi.object({
  business_name: Joi.string().min(2).max(255).required(),
  tagline: Joi.string().max(255).allow("", null),
  description: Joi.string().allow("", null),
  address: Joi.string().min(5).max(512).required(),
  latitude: Joi.number().min(-90).max(90).allow(null),
  longitude: Joi.number().min(-180).max(180).allow(null),
  cover_image_url: Joi.string().uri().allow("", null)
});

const vendorUpdate = Joi.object({
  business_name: Joi.string().min(2).max(255),
  tagline: Joi.string().max(255).allow("", null),
  description: Joi.string().allow("", null),
  address: Joi.string().min(5).max(512),
  latitude: Joi.number().min(-90).max(90).allow(null),
  longitude: Joi.number().min(-180).max(180).allow(null),
  cover_image_url: Joi.string().uri().allow("", null),
  status: Joi.string().valid("pending", "active", "suspended")
}).min(1);

const categoryCreate = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  slug: Joi.string().min(2).max(160).required()
});

const productCreate = Joi.object({
  category_id: Joi.number().integer().positive().allow(null),
  name: Joi.string().min(2).max(255).required(),
  description: Joi.string().allow("", null),
  price: Joi.number().positive().max(999999).required(),
  image_url: Joi.string().uri().allow("", null),
  is_available: Joi.boolean().default(true)
});

const productUpdate = Joi.object({
  category_id: Joi.number().integer().positive().allow(null),
  name: Joi.string().min(2).max(255),
  description: Joi.string().allow("", null),
  price: Joi.number().positive().max(999999),
  image_url: Joi.string().uri().allow("", null),
  is_available: Joi.boolean()
}).min(1);

const cartItem = Joi.object({
  product_id: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().min(1).max(999).required()
});

const cartItemQty = Joi.object({
  quantity: Joi.number().integer().min(1).max(999).required()
});

const checkout = Joi.object({
  delivery_address: Joi.string().min(5).max(512).required(),
  notes: Joi.string().max(500).allow("", null),
  delivery_fee: Joi.number().min(0).max(500).default(2.99),
  tax_rate: Joi.number().min(0).max(0.5).default(0.08)
});

const orderStatusUpdate = Joi.object({
  status: Joi.string()
    .valid(
      "pending",
      "confirmed",
      "preparing",
      "ready_for_pickup",
      "out_for_delivery",
      "delivered",
      "cancelled"
    )
    .required()
});

const trackingCreate = Joi.object({
  status_note: Joi.string().min(2).max(255).required(),
  latitude: Joi.number().min(-90).max(90).allow(null),
  longitude: Joi.number().min(-180).max(180).allow(null)
});

const paymentMock = Joi.object({
  method: Joi.string().valid("card", "cash", "wallet_mock").default("wallet_mock")
});

const reviewCreate = Joi.object({
  order_id: Joi.number().integer().positive().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(2000).allow("", null)
});

const deliveryProfile = Joi.object({
  vehicle_type: Joi.string().max(64).allow("", null),
  license_plate: Joi.string().max(32).allow("", null),
  is_available: Joi.boolean()
}).min(1);

const profilePatch = Joi.object({
  full_name: Joi.string().min(2).max(255),
  phone: Joi.string().max(32).allow("", null),
  avatar_url: Joi.string().uri().allow("", null),
  current_password: Joi.string().allow("", null),
  new_password: Joi.string().min(8).max(128).allow("", null)
})
  .min(1)
  .with("new_password", "current_password");

const vendorPostCreate = Joi.object({
  title: Joi.string().min(2).max(255).required(),
  body: Joi.string().allow("", null),
  image_url: Joi.string().uri().allow("", null),
  latitude: Joi.number().min(-90).max(90).allow(null),
  longitude: Joi.number().min(-180).max(180).allow(null),
  is_active: Joi.boolean()
});

const vendorPostUpdate = Joi.object({
  title: Joi.string().min(2).max(255),
  body: Joi.string().allow("", null),
  image_url: Joi.string().uri().allow("", null),
  latitude: Joi.number().min(-90).max(90).allow(null),
  longitude: Joi.number().min(-180).max(180).allow(null),
  is_active: Joi.boolean()
}).min(1);

module.exports = {
  register,
  login,
  vendorCreate,
  vendorUpdate,
  categoryCreate,
  productCreate,
  productUpdate,
  cartItem,
  cartItemQty,
  checkout,
  orderStatusUpdate,
  trackingCreate,
  paymentMock,
  reviewCreate,
  deliveryProfile,
  profilePatch,
  vendorPostCreate,
  vendorPostUpdate
};
