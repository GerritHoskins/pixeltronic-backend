import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, process.cwd() + '/public/assets/uploads');
  },
  filename: function (req: any, file: any, cb: any) {
    //cb(null, Date.now() + file.originalname.replace(/\s+/g, '-'));
    cb(null, file.originalname.replace(/\s+/g, '-'));
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});
