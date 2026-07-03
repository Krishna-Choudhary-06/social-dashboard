const Media = require('../models/media.model');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/response');
const { getFileExtension, validateMediaType, buildMediaUrl } = require('../utils/media');
const httpStatus = require('../constants/httpStatus');

const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'No file uploaded', 'VALIDATION_ERROR'));
    }

    const mimeType = req.file.mimetype;
    if (!validateMediaType(mimeType)) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'Unsupported file type', 'INVALID_FILE_TYPE'));
    }

    const extension = getFileExtension(req.file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`;
    const media = await Media.create({
      filename,
      originalName: req.file.originalname,
      mimeType,
      size: req.file.size,
      url: buildMediaUrl(filename),
      uploadedBy: req.userId,
    });

    return sendSuccess(res, media, httpStatus.CREATED, 'Media uploaded successfully');
  } catch (error) {
    return next(error);
  }
};

const listMedia = async (req, res, next) => {
  try {
    const media = await Media.find({ uploadedBy: req.userId }).sort({ createdAt: -1 });
    return sendSuccess(res, media, httpStatus.OK, 'Media fetched successfully');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  uploadMedia,
  listMedia,
};
