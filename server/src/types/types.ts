import mongoose, { Document, Types } from "mongoose";

export interface IAdvert {
  _id?: mongoose.Types.ObjectId;
  text: string;
  logo?: Buffer;
  logoMimeType?: string;
  createdAt: Date;
  isTop?: boolean;
}

export interface CompanyDoc extends Document {
  _id: Types.ObjectId;
  ico: string;
  name: string;
  address: string;
  adverts: Types.DocumentArray<IAdvert>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiCompany {
  fullNames?: { value: string }[];
  identifiers?: { value: string }[];
  addresses?: {
    street?: string;
    regNumber?: string;
    municipality?: { value: string };
  }[];
}

export interface ApiResponse {
  results: ApiCompany[];
}

export interface MulterRequest extends Request {
  file?: Express.Multer.File;
}
