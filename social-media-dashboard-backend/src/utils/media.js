const getFileExtension = (filename = '') => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

const validateMediaType = (mimeType = '') => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
  return allowedTypes.includes(mimeType);
};

const buildMediaUrl = (filename) => `/uploads/${filename}`;

module.exports = {
  getFileExtension,
  validateMediaType,
  buildMediaUrl,
};
