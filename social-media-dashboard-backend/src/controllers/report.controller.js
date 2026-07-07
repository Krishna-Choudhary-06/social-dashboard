const reportService = require('../services/report.service');
const { sendSuccess } = require('../utils/response');
const httpStatus = require('../constants/httpStatus');

const generateReport = async (req, res, next) => {
  try {
    const report = await reportService.generateReport({
      workspaceId: req.params.workspaceId,
      userId: req.userId,
      payload: req.body,
    });

    return sendSuccess(res, report, httpStatus.CREATED, 'Report generated successfully');
  } catch (error) {
    return next(error);
  }
};

const { getPaginationMetadata } = require('../utils/pagination');

const listReports = async (req, res, next) => {
  try {
    const { page, limit } = req.queryOptions || { page: 1, limit: 10 };
    
    const { reports, total } = await reportService.listReports({
      workspaceId: req.params.workspaceId,
      userId: req.userId,
      queryOptions: req.queryOptions,
    });

    return sendSuccess(
      res, 
      { 
        reports, 
        pagination: getPaginationMetadata(page, limit, total) 
      }, 
      httpStatus.OK, 
      'Reports fetched successfully'
    );
  } catch (error) {
    return next(error);
  }
};

const getReport = async (req, res, next) => {
  try {
    const report = await reportService.getReport({
      reportId: req.params.reportId,
      userId: req.userId,
    });

    return sendSuccess(res, report, httpStatus.OK, 'Report fetched successfully');
  } catch (error) {
    return next(error);
  }
};

const downloadReport = async (req, res, next) => {
  try {
    const result = await reportService.downloadReport({
      reportId: req.params.reportId,
      userId: req.userId,
    });

    return sendSuccess(res, result, httpStatus.OK, 'Report downloaded successfully');
  } catch (error) {
    return next(error);
  }
};

const deleteReport = async (req, res, next) => {
  try {
    const report = await reportService.deleteReport({
      reportId: req.params.reportId,
      userId: req.userId,
    });

    return sendSuccess(res, report, httpStatus.OK, 'Report deleted successfully');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  generateReport,
  listReports,
  getReport,
  downloadReport,
  deleteReport,
};
