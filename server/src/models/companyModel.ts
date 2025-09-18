import mongoose, { Schema, Model } from "mongoose";
import { CompanyDoc, IAdvert } from "../types/types";

const AdvertSchema = new Schema<IAdvert>(
  {
    text: { type: String, required: true },
    logo: { type: Buffer },
    logoMimeType: { type: String },
    createdAt: { type: Date, default: () => new Date() },
    isTop: { type: Boolean, default: false },
  },

  { _id: true }
);

const CompanySchema = new Schema<CompanyDoc>(
  {
    ico: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    adverts: { type: [AdvertSchema], default: [] },
  },
  { timestamps: true }
);

CompanySchema.index({ createdAt: -1 });

export const CompanyModel: Model<CompanyDoc> = mongoose.model<CompanyDoc>(
  "Company",
  CompanySchema,
  "companies"
);
