import multer from "multer";
import path from "path";

// correct path so it points to existing "uploads" folder in project root
const uploadPath = path.join(process.cwd(), "uploads");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only .jpeg, .jpg and .png formats are allowed"), false);
    }
};

export const upload = multer({ storage, fileFilter });
