import Joi from 'joi';

export const addCustomerSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "any.required": "Mời nhập tên khách hàng",
    "string.empty": "Tên khách hàng không được để trống",
  }),
  totalRawCF: Joi.number().min(0).required().messages({
    "any.required": "Tổng cà tươi là trường bắt buộc",
    "number.base": "Tổng cà tươi phải là số",
    "number.min": "Tổng cà tươi không được là số âm",
  }),
  totalCF: Joi.number().min(0).required().messages({
    "any.required": "Tổng cà nhân là trường bắt buộc",
    "number.base": "Tổng cà nhân phải là số",
    "number.min": "Tổng cà nhân không được là số âm",
  }),
  totalPepper: Joi.number().min(0).required().messages({
    "any.required": "Tổng tiêu là trường bắt buộc",
    "number.base": "Tổng tiêu phải là số",
    "number.min": "Tổng tiêu không được là số âm",
  }),
  debit: Joi.number().min(0).required().messages({
    "any.required": "Số tiền nợ là trường bắt buộc",
    "number.base": "Số tiền nợ phải là số",
    "number.min": "Số tiền nợ không được là số âm",
  }),
  credit: Joi.number().min(0).required().messages({
    "any.required": "Số tiền gửi là trường bắt buộc",
    "number.base": "Số tiền gửi phải là số",
    "number.min": "Số tiền gửi không được là số âm",
  }),
  address: Joi.string().allow(null).messages({
    "string.empty": "Địa chỉ không được để trống",
  }),
  phoneNumber: Joi.string().allow(null).messages({
    "string.empty": "Số điện thoại không được để trống",
  }),
  bankAccount: Joi.string().allow(null).messages({
    "string.empty": "Tài khoản ngân hàng không được để trống",
  }),
  note: Joi.string().allow(null).messages({
    "string.empty": "Ghi chú không được để trống",
  }),
});
