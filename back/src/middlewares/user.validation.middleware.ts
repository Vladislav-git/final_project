import * as yup from 'yup';

let registrationSchema = yup.object().shape({
    firstname: yup.string().min(3).required(),
    secondname: yup.string().min(3).required(),
    password: yup.string().min(5).required(),
    email: yup.string().email(),
    created_date: yup.string(),
    user_id: yup.string(),
});

const validate = (shema:any) => (req:any, res:any, next:any) => {
    shema.isValid(req.body)
        .then((data:any) => {
            if (data) {
                console.log(1)
                next()
            } else {
                console.log(2)
                res.send('not valid')
            }
        })
        .catch((err:any) => res.send(err.message))
}

export default validate(registrationSchema);