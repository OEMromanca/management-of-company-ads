import { Request, Response } from "express";
import { CompanyModel } from "../models/companyModel";
import mongoose from "mongoose";
import { IAdvert } from "../types/types";
import {
  formatLogoToBase64,
  sortAds,
  validateQueryOrIco,
} from "../utils/utils";

export const searchCompanies = async (req: Request, res: Response) => {
  try {
    const { queryStr, icoStr } = validateQueryOrIco(
      req.query.query as string,
      req.query.ico as string
    );

    if (icoStr) {
      const companies = await CompanyModel.find({
        ico: { $regex: `^${icoStr}`, $options: "i" },
      })
        .sort({ name: 1 })
        .limit(10);

      return res.json(companies);
    }

    if (queryStr) {
      const companies = await CompanyModel.find({
        name: { $regex: queryStr, $options: "i" },
      })
        .sort({ name: 1 })
        .limit(10);

      return res.json(companies);
    }
  } catch (err) {
    console.error("❌ Error during search:", err);
    return res.status(400).json({ error: "Error during search" });
  }
};

export const addAdvertToCompany = async (req: Request, res: Response) => {
  try {
    const { ico } = req.params;
    const { adText } = req.body;

    const company = await CompanyModel.findOne({ ico });
    if (!company) {
      return res
        .status(404)
        .json({ error: "Company with this ICO does not exist" });
    }

    const newAdvert: IAdvert & { _id: mongoose.Types.ObjectId } = {
      _id: new mongoose.Types.ObjectId(),
      text: adText,
      createdAt: new Date(),
    };

    if (req.file?.buffer && req.file?.mimetype) {
      newAdvert.logo = req.file.buffer;
      newAdvert.logoMimeType = req.file.mimetype;
    }

    company.adverts.push(newAdvert);
    await company.save();

    res.json({ message: "Advert and logo successfully saved", company });
  } catch (err) {
    console.error("❌ Error saving advert:", err);
    res.status(500).json({ error: "Error saving advert" });
  }
};

export const getAllAds = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const companies = await CompanyModel.find({
      "adverts.0": { $exists: true },
    });

    const adsUnsorted = companies.flatMap((c) =>
      c.adverts.map((adv) => ({
        _id: adv._id,
        companyId: c._id.toString(),
        companyName: c.name,
        ico: c.ico,
        address: c.address,
        isTop: adv.isTop ?? false,
        text: adv.text,
        logoBase64: formatLogoToBase64(adv),
        createdAt: adv.createdAt,
      }))
    );

    const total = adsUnsorted.length;
    const adsSorted = sortAds(adsUnsorted).slice(skip, skip + limit);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      ads: adsSorted,
    });
  } catch (err) {
    console.error("❌ Error fetching ads:", err);
    res.status(500).json({ error: "Error fetching ads" });
  }
};

export const deleteAdvertById = async (req: Request, res: Response) => {
  try {
    const { advertId } = req.params;

    const company = await CompanyModel.findOne({ "adverts._id": advertId });
    if (!company)
      return res.status(404).json({ error: "Advert does not exist" });

    company.adverts.pull({ _id: advertId });
    await company.save();

    res.json({ message: "✅ Advert successfully deleted" });
  } catch (err) {
    console.error("❌ Error deleting advert:", err);
    res.status(500).json({ error: "Error deleting advert" });
  }
};

export const updateAdvertById = async (req: Request, res: Response) => {
  try {
    const advertId = req.params.advertId;
    const { adText } = req.body;

    if (!advertId)
      return res.status(400).json({ error: "❌ Missing advertId parameter" });

    const company = await CompanyModel.findOne({ "adverts._id": advertId });
    if (!company)
      return res.status(404).json({ error: "Advert does not exist" });

    const advert = company.adverts.id(advertId);
    if (!advert)
      return res.status(404).json({ error: "Advert does not exist" });

    if (adText) advert.text = adText;

    await company.save();

    res.json({
      message: "✅ Advert successfully updated",
      advert: {
        _id: advert._id,
        text: advert.text,
        logoBase64: formatLogoToBase64(advert),
        createdAt: advert.createdAt,
      },
    });
  } catch (err) {
    console.error("❌ Error updating advert:", err);
    res.status(500).json({ error: "Error updating advert" });
  }
};

export const toggleTopAdvert = async (req: Request, res: Response) => {
  const { advertId } = req.params;

  if (!advertId) return res.status(400).json({ message: "Missing advertId" });

  try {
    const company = await CompanyModel.findOne({ "adverts._id": advertId });
    if (!company) return res.status(404).json({ message: "Advert not found" });

    const advert = company.adverts.id(advertId);
    if (!advert) return res.status(404).json({ message: "Advert not found" });

    advert.isTop = !advert.isTop;
    await company.save();

    res.json({
      message: advert.isTop ? "✅ Advert is now top" : "✅ Advert top removed",
      advert: {
        _id: advert._id,
        text: advert.text,
        isTop: advert.isTop,
        createdAt: advert.createdAt,
      },
    });
  } catch (err) {
    console.error("❌ Error toggling top advert:", err);
    res.status(500).json({ message: "Server error" });
  }
};
