import Joi from 'joi';

export const addAgencySchema = Joi.object({
    name: Joi.string().required().trim().messages({
        "any.required": "Mời nhập tên đại lý",
        "string.empty": "Tên đại lý không được để trống"
    }),
   
    debit: Joi.number().min(0).required().messages({
        "any.required": "Số tiền nợ là trường bắt buộc",
        "number.min": "Không được nhập số âm"
    }),
    credit: Joi.number().min(0).required().messages({
        "any.required": "Số tiền gửi là trường bắt buộc",
        "number.min": "Không được nhập số âm"
    }),
    phoneNumber: Joi.string().allow(null).pattern(/^[0-9]{10,15}$/).messages({
        "string.pattern.base": "Số điện thoại phải chứa từ 10 đến 15 chữ số",
        "string.empty": "Số điện thoại không được để trống"
    }),
    bankAccount: Joi.string().allow(null).messages({
        "string.empty": "Tài khoản ngân hàng không được để trống"
    }),
    note: Joi.string().allow(null).messages({
        "string.empty": "Ghi chú không được để trống"
    }),
    address: Joi.string().allow(null).messages({
        "string.empty": "Địa chỉ không được để trống"
    }),
    
  
});
