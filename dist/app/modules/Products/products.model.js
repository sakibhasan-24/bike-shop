"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const reviewSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    text: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const BikeModel = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "name field must be required"],
    },
    brand: {
        type: String,
        required: [true, "brand field must be required"],
    },
    price: {
        type: Number,
        required: true,
        min: 1,
    },
    description: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    inStock: {
        type: Boolean,
        required: true,
        default: true,
    },
    reviews: [reviewSchema],
    averageRating: {
        type: Number,
        default: 0,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: {
            values: ["Mountain", "Road", "Hybrid", "Electric"],
            message: "{VALUE} is not a valid category.",
        },
        required: [true, "The category field is required."],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
BikeModel.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    this.select("-isDeleted");
    next();
});
BikeModel.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    this.select("-isDeleted");
    next();
});
const Bike = (0, mongoose_1.model)("Product", BikeModel);
exports.default = Bike;
