import * as yup from 'yup';

export let registrationSchema = yup.object().shape({
    firstname: yup.string().min(3).required(),
    secondname: yup.string().min(3).required(),
    password: yup.string().min(5).required(),
    email: yup.string().email().required(),
});

export let loginShema = yup.object().shape({
    password: yup.string().min(5).required(),
    email: yup.string().email().required(),
});