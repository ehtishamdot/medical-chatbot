import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const runMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export const multerMiddleware = upload.single("file");
