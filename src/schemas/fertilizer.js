import Joi from 'joi';

export const addFertilizerSchema = Joi.object({
    name: Joi.string().required().trim().messages({
        "any.required": "Tên phân bón là trường bắt buộc",
        "string.empty": "Tên phân bón không được để trống",
    }),
    provider: Joi.object().required().messages({
        "any.required": "Nhà cung cấp là trường bắt buộc",
       
    }),
});
