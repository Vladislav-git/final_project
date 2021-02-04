import * as yup from 'yup';

let registrationSchema = yup.object().shape({
    firstname: yup.string().min(3).required(),
    secondname: yup.string().min(3).required(),
    password: yup.string().min(5).required(),
    email: yup.string().email().required(),
});

let loginShema = yup.object().shape({
    password: yup.string().min(5).required(),
    email: yup.string().email().required(),
});

const validate = (shema:any) => (req:any, res:any, next:any) => {
    shema.isValid(req.body)
        .then((data:any) => {
            if (data) {
                next()
            } else {
                res.send('not valid')
            }
        })
        .catch((err:any) => res.send(err.message))
}

export const registerValidate = validate(registrationSchema)
export const loginValidate = validate(loginShema)