import Joi from 'joi';

export const addPurchaseInvoiceSchema = Joi.object({
  customer: Joi.object({
    _id: Joi.string().allow(null).messages({
      "string.base": "ID nhà cung cấp phải là chuỗi",
     
    }),
    name: Joi.string().allow(null).messages({
      "string.base": "Tên nhà cung cấp phải là chuỗi"
    })
  }).allow(null).messages({
    "object.base": "Thông tin nhà cung cấp không đúng định dạng"
  }),
  date: Joi.string().required().messages({
    "date.base": "Ngày không hợp lệ",
    "any.required": "Ngày là trường bắt buộc"
  }),
  type: Joi.string().required().messages({
    "string.base": "Loại hóa đơn phải là chuỗi",
    "any.required": "Loại hóa đơn là trường bắt buộc"
  }),
  totalAmount: Joi.number().min(0).required().messages({
    "number.base": "Tổng số tiền phải là số",
    "number.min": "Tổng số tiền không được là số âm",
    "any.required": "Tổng số tiền là trường bắt buộc"
  }),
  importPrice: Joi.number().allow(null).messages({
    "number.base": "Giá nhập khẩu phải là số"
  }),
  status: Joi.string().required().messages({
    "string.base": "Trạng thái phải là chuỗi",
    "any.required": "Trạng thái là trường bắt buộc"
  }),
  note: Joi.string().allow(null).messages({
    "string.base": "Ghi chú phải là chuỗi"
  }),
  detailAmount: Joi.array().items(Joi.number()).allow(null).messages({
    "array.base": "Chi tiết số tiền phải là mảng",
    "array.items": "Chi tiết số tiền không đúng định dạng"
  }),
  humidity: Joi.number().allow(null).messages({
    "number.base": "Độ ẩm phải là số"
  }),
  zem: Joi.number().allow(null).messages({
    "number.base": "Zem phải là số"
  }),
  packaging: Joi.number().allow(null).messages({
    "number.base": "Số cân của bì phải là số"
  }),
  unitPrice: Joi.number().allow(null).messages({
    "number.base": "Giá đơn vị phải là số"
  }),
  billId: Joi.string().allow(null).messages({
  "string.base": "bill Id phải là chuỗi"
    })
});
