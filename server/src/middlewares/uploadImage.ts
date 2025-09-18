import multer from "multer";

const storage = multer.memoryStorage();

export const uploadImage = multer({
  storage,
  fileFilter: (_, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(new Error("Only PNG or JPG files are allowed"));
    }
  },
});
