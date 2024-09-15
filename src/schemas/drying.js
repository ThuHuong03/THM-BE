import Joi from 'joi';

export const addCustomerSchema = Joi.object({
  date: Joi.date().required().messages({
    "any.required": "Ngày là trường bắt buộc",
    "date.base": "Ngày không hợp lệ"
  }),
  totalRawCF: Joi.number().min(0).required().messages({
    "any.required": "Tổng cà tươi là trường bắt buộc",
    "number.base": "Tổng cà tươi phải là số",
    "number.min": "Tổng cà tươi không được là số âm"
  }),
  listRawCF: Joi.array().items(Joi.object()).allow(null).messages({
    "array.base": "Danh sách cà tươi phải là mảng",
    "array.items": "Danh sách cà tươi không đúng định dạng"
  }),
  totalCF: Joi.number().min(0).required().messages({
    "any.required": "Tổng cà nhân là trường bắt buộc",
    "number.base": "Tổng cà nhân phải là số",
    "number.min": "Tổng cà nhân không được là số âm"
  }),
  processTime: Joi.object().required().messages({
    "any.required": "Thời gian xử lý là trường bắt buộc",
    "object.base": "Thời gian xử lý không đúng định dạng"
  }),
  humidity: Joi.number().allow(null).messages({
    "number.base": "Độ ẩm phải là số"
  }),
  realityCF: Joi.number().allow(null).messages({
    "number.base": "Cà thực tế phải là số"
  })
});
