import Joi from 'joi';

export const addSaleInvoiceSchema = Joi.object({
    customer: Joi.object({
        _id: Joi.string().optional().allow(null).messages({
            "string.base": "ID khách hàng phải là chuỗi hợp lệ"
        }),
        name: Joi.string().optional().allow(null).messages({
            "string.base": "Tên khách hàng phải là chuỗi hợp lệ"
        }),
    }).optional(),
    date: Joi.string().required().messages({
        "any.required": "Ngày là trường bắt buộc",
        "date.base": "Ngày phải là định dạng ngày hợp lệ"
    }),
    type: Joi.string().required().messages({
        "any.required": "sản phẩm là trường bắt buộc",
        "string.base": "Lsản phẩm phải là chuỗi hợp lệ"
    }),
    totalAmount: Joi.number().required().messages({
        "any.required": "Tổng số lượng là trường bắt buộc",
        "number.base": "Tổng số lượng phải là số hợp lệ"
    }),
    unitPrice: Joi.number().optional().allow(null).messages({
        "number.base": "Đơn giá phải là số hợp lệ"
    }),
    salePrice: Joi.number().optional().allow(null).messages({
        "number.base": "Giá bán phải là số hợp lệ"
    }),

    note: Joi.string().optional().allow(null).messages({
        "string.base": "Ghi chú phải là chuỗi hợp lệ"
    }),
    billId: Joi.string().optional().allow(null).messages({
        "string.base": "ID hóa đơn phải là chuỗi hợp lệ"
    })
});
