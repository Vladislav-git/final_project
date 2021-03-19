import axios from 'axios';
import React, {useState} from 'react';
import {Text, TouchableOpacity, TextInput, View, StyleSheet, Dimensions} from 'react-native';
import {registrationSchema} from '../validation/validation'
import {useC} from '../context/Context'
import { StatusBar } from 'expo-status-bar';

const bcrypt = require('react-native-bcrypt');

const initialRegistrationModel = {
    firstname: '',
    secondname: '',
    email: '',
    password: '',
    created_date: '',
}

const Register = ({navigation}:any) => {

    const [registrationModel, setRegistrationModel] = useState(initialRegistrationModel)
    const {darkTheme}:any = useC();
    const [err, setErr] = useState('')

    const handleSubmit = (schema:object) => {
        return registrationSchema.validate(schema)
            .then(data => {
                let validData = {...data,
                    created_date: '',
                }
                const cryptedpass = bcrypt.hashSync(validData.password, 10);
                validData.password = cryptedpass;
                validData.created_date = (new Date()).toString()
                axios({
                    method: 'post',
                    url: 'http://10.0.2.2:8000/api/register',
                    data: validData,
                })
                    .then(resp => {
                        if (resp.data === 'user created') {
                            return navigation.navigate('Login')
                        } else {
                            setErr(resp.data)
                            alert(err)
                        }
                    })
                    .catch(err => alert(err.message));
            })
            .catch(err => alert(err.message))
    }

    return (
        <View style={{...styles.MainView, backgroundColor: darkTheme ? 'black' : 'lightgrey'}}>
            <StatusBar style={darkTheme ? "light" : 'dark'} />
            <View style={{...styles.FormContainer, backgroundColor: darkTheme ? '#141414' : 'white'}}>
                <Text style={{...styles.Header, color: darkTheme ? 'white' : 'black'}}>My Project Register</Text>
                <Text style={{...styles.Text, color: darkTheme ? 'white' : 'black'}}>Firstname:</Text>
                <TextInput
                style={{...styles.Input, color: darkTheme ? 'white' : 'black'}}
                value={registrationModel.firstname}
                onChangeText={(firstname) => setRegistrationModel({...registrationModel, firstname: firstname})}
                />
                <Text style={{...styles.Text, color: darkTheme ? 'white' : 'black'}}>Secondname:</Text>
                <TextInput
                style={{...styles.Input, color: darkTheme ? 'white' : 'black'}} 
                value={registrationModel.secondname}
                onChangeText={(secondname) => setRegistrationModel({...registrationModel, secondname: secondname})}
                />
                <Text style={{...styles.Text, color: darkTheme ? 'white' : 'black'}}>Email:</Text>
                <TextInput
                style={{...styles.Input, color: darkTheme ? 'white' : 'black'}} 
                value={registrationModel.email}
                onChangeText={(email) => setRegistrationModel({...registrationModel, email: email})}
                />
                <Text style={{...styles.Text, color: darkTheme ? 'white' : 'black'}}>Password:</Text>
                <TextInput
                style={{...styles.Input, color: darkTheme ? 'white' : 'black'}} 
                value={registrationModel.password}
                secureTextEntry
                onChangeText={(password) => setRegistrationModel({...registrationModel, password: password})}
                />
                <TouchableOpacity style={{...styles.Button, backgroundColor: darkTheme ? '#4a4a4a' :"#327ba8"}} onPress={() => handleSubmit(registrationModel)}>
                    <Text style={styles.ButtonText}>Sign In</Text>
                </TouchableOpacity>
            </View>
            
        </View>    
    )
}

const styles = StyleSheet.create({
    Input: {
        height: 35,
        width: '55%',
        borderColor: 'gray',
        borderWidth: 1,
        alignSelf: 'center', 
        borderRadius: 5,
        fontSize: 20,
    },
    FormContainer: {
        width: '90%',
        height: '70%',
        marginTop: '10%',
        borderColor: 'gray',
        borderWidth: 1,
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        elevation: 8,
    },
    Button: {
        borderRadius: 5,
        height: "8%",
        width: '55%',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: '10%',
    },
    ButtonText: {
        fontSize: 14,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        
    },
    Header: {
        fontSize: 25,
        alignSelf: "center",
        marginTop: '7%',
        fontWeight: 'bold',
    },
    MainView: {
        height: Dimensions.get('screen').height,
        width:'100%',
    },
    Text: {
        fontSize: 14,
        marginTop: '7%',
        marginLeft: '23%'
    }
})

export default Register;