import React, {useState} from 'react';
import {Text, TouchableOpacity, TextInput, View, StyleSheet, Image} from 'react-native';
import axios from 'axios';
import {useC, useUpdateC} from '../context/Context'
import * as Google from 'expo-google-app-auth';
import {loginShema} from '../validation/validation'

const initialLoginModel = {
    email: '',
    password: '',
}

const Login = ({navigation}:any) => {

    const {darkTheme, data}:any = useC();
    const {updateData}:any = useUpdateC();
    const [loginModel, setLoginModel] = useState(initialLoginModel)
    const [err, setErr] = useState('')

    const handleGoogle = async () => {
        try {
            const result = await Google.logInAsync({
                androidClientId: '933995381178-e1mo4pk5uks75i9q68e1v32t5bjq4sen.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
            });
            if (result.type === 'success') {
                axios({
                    method: 'post',
                    url: 'http://10.0.2.2:8000/google',
                    data: result.user,
                })
                    .then(resp => {
                        if (resp.data != 'no such user' && resp.data != 'wrong password') {
                            updateData(resp.data)
                            return navigation.navigate('Profile')
                        } else {
                            setErr(resp.data)
                            alert(err)
                        }
                    })
                    .catch(error => {
                        setErr(error)
                        alert(err)
                    })
            } else {
                setErr('err')
                alert(err)
            }
        } catch (e) {
            setErr(e)
            alert(err)
        }
    }

    const handleSubmit = (shema:any) => {
        return loginShema.validate(shema)
            .then(data => {
                const validData = {...data}
                axios({
                    method: 'post',
                    url: 'http://10.0.2.2:8000/login',
                    data: validData,
                })
                    .then(resp => {
                        // console.log(resp.data)
                        if (resp.data != 'no such user' && resp.data != 'wrong password') {
                            updateData(resp.data)
                            return navigation.navigate('Profile')
                        } else {
                            setErr(resp.data)
                            alert(err)
                        }
                        
                    })
                    .catch(error => {
                        setErr(error.message)
                        alert(err)
                    })
            })
            .catch(error => {
                setErr(error.message)
                alert(err)
            })
    }

    return (
        <View style={{...styles.MainView, backgroundColor: darkTheme ? 'black' : 'lightgrey'}}>
            <View style={styles.FormContainer}>
                <Text style={styles.Header}>My Project Login</Text>
                <Text style={styles.Text}>Email:</Text>
                <TextInput
                style={styles.Input}
                placeholderTextColor='grey'
                value={loginModel.email}
                onChangeText={(email) => setLoginModel({...loginModel, email: email})}
                />
                <Text style={styles.Text}>Password:</Text>
                <TextInput
                style={styles.Input}
                placeholderTextColor='grey'
                value={loginModel.password}
                onChangeText={(password) => setLoginModel({...loginModel, password: password})}
                />
                <TouchableOpacity style={{...styles.Button, backgroundColor: darkTheme ? 'orange' :"#327ba8"}} onPress={() => handleSubmit(loginModel)}>
                    <Text style={styles.ButtonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{...styles.Button, backgroundColor: darkTheme ? 'orange' :"#327ba8"}} onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.ButtonText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{...styles.GoogleButton, backgroundColor: darkTheme ? 'orange' :"#0e4f0c"}}
                    onPress={async () => handleGoogle()}
                >
                    <Image
                    source={require('../../assets/google.png')}
                    style={{width: '20%', height: "95%", marginRight: '5%', marginTop:"0.5%"}}
                    resizeMode="stretch"
                    />
                    <Text style={styles.GoogleText}>Log in with Google</Text>
                </TouchableOpacity>
            </View>
        </View>
        
        
    )
}

const styles = StyleSheet.create({
    Input: {
        height: 40,
        width: '55%',
        borderColor: 'gray',
        borderWidth: 1,
        alignSelf: 'center', 
        borderRadius: 5,
        fontSize: 20,
    },
    FormContainer: {
        width: '90%',
        height: '90%',
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
        marginTop: '15%',
        fontWeight: 'bold',
    },
    MainView: {
        height:'100%',
        width:'100%',
    },
    Text: {
        fontSize: 14,
        marginTop: '10%',
        marginLeft: '23%'
    },
    Error: {
        height: 40,
        fontSize: 14,
        color: 'red',
        marginTop: '10%',
        alignSelf: 'center'
    },
    GoogleButton: {
        borderRadius: 5,
        height: "8%",
        width: '55%',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: '10%',
        flexDirection: 'row'
    },
    GoogleText: {
        fontSize: 14,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: 'center',
        marginRight: '16%'
    },
})

export default Login;