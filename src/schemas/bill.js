import Joi from 'joi';

export const addBillSchema = Joi.object({

  customer: Joi.object({
    _id: Joi.string().allow(null).messages({
      "string.base": "ID khách hàng phải là chuỗi",
    }),
    name: Joi.string().allow(null).messages({
      "string.base": "Tên khách hàng phải là chuỗi",
      "string.empty": "Tên khách hàng không được để trống"
    })
  }).messages({
    "object.base": "Thông tin khách hàng không đúng định dạng",
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
  exportPrice: Joi.number().allow(null).messages({
    "number.base": "Giá xuất khẩu phải là số"
  }),
  status: Joi.string().required().messages({
    "string.base": "Trạng thái phải là chuỗi",
    "any.required": "tình trạng  không được để trống"
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
    "number.base": "Đóng gói phải là số"
  }),
  purchaseInvoiceId: Joi.string().allow(null).messages({
    "string.base": "ID hóa đơn mua phải là chuỗi"
  })
});

    

