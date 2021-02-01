import * as yup from 'yup';

let registrationSchema = yup.object().shape({
    firstname: yup.string().min(3).required(),
    secondname: yup.string().min(3).required(),
    password: yup.string().min(5).required(),
    email: yup.string().email(),
    created_date: yup.string(),
    user_id: yup.string(),
});

export default registrationSchema;