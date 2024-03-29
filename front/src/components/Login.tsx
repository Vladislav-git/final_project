import React, {useState, useRef} from 'react';
import {Text, TouchableOpacity, TextInput, View, StyleSheet, Image, Modal, Dimensions, Platform} from 'react-native';
import {FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import axios from 'axios';
import {useC, useUpdateC} from '../context/Context'
import * as Google from 'expo-google-app-auth';
import {loginShema} from '../validation/validation'
import firebase from 'firebase'
import { StatusBar } from 'expo-status-bar';

interface Profile {
    _id: string,
    firstname: string,
    secondname: string,
    email: string,
    password: string,
    created_date: string,
    profile: ProfileData,
    friends: Array<string>,
    images: Array<string>,
    videos: Array<string>,
    avatar: string,
    chats: Array<string>
}

interface User {
    user_profile: string,
    token: string,
    user: Profile,
    post: Post,
    current_chat: [CurrentChat]
}
interface Post {
	_id: string,
	user_name: string,
    user_img: string,
    user_id: string,
    post_text: string,
    post_img: string,
    post_video: string,
    like_number: Number,
    who_liked: Array<string>,
    comments: Array<string>,
    comment_number: Number
}

interface ProfileData {
    gender: string,
    birth_date: string,
    city: string,
    phone_number: string,
}

interface CurrentChat {
    _id: string,
    chat_user_id: string,
    current_user_id: string
}

const initialLoginModel = {
    email: '',
    password: '',
}

const Login = ({navigation}:any) => {

    const {darkTheme, context} = useC();
    const {updateData}:any = useUpdateC();

    const recaptchaVerifier:any = useRef(null);

    const firebaseConfig:any = firebase.apps.length ? firebase.app().options : undefined;

    const [loginModel, setLoginModel] = useState(initialLoginModel)
    const [err, setErr] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isVisible, setIsVisible] = useState(false)
    const [result, setResult]:any = useState()
    
    const handleGoogle = async () => {
        try {
            const result:any = await Google.logInAsync({
                androidClientId: '7827040613-v22eje7tjjptnnkn8ec1erl9lts7u0q1.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
            });
            if (result.type === 'success') {
                setResult(result)
                setIsVisible(true)
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
                    url: 'http://192.168.31.181:8000/api/login', //192.168.31.181
                    data: validData,
                })
                    .then(resp => {
                        if (resp.data != 'no such user' && resp.data != 'wrong password') {
                            delete resp.data.user.__v
                            const alldata:User = resp.data 
                            updateData(alldata)
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
            <StatusBar style={darkTheme ? "light" : 'dark'} />
            <View style={{...styles.FormContainer, backgroundColor: darkTheme ? '#141414' : 'white'}}>
                <Text style={{...styles.Header, color: darkTheme ? 'white' : 'black'}}>My Project Login</Text>
                <Text style={{...styles.Text, color: darkTheme ? 'white' : 'black'}}>Email:</Text>
                <TextInput
                style={{...styles.Input, color: darkTheme ? 'white' : 'black'}}
                placeholderTextColor='grey'
                value={loginModel.email}
                onChangeText={(email) => setLoginModel({...loginModel, email: email})}
                />
                <Text style={{...styles.Text, color: darkTheme ? 'white' : 'black'}}>Password:</Text>
                <TextInput
                style={{...styles.Input, color: darkTheme ? 'white' : 'black'}}
                placeholderTextColor='grey'
                value={loginModel.password}
                secureTextEntry
                onChangeText={(password) => setLoginModel({...loginModel, password: password})}
                />
                <TouchableOpacity style={{...styles.Button, backgroundColor: darkTheme ? '#4a4a4a' :"#327ba8"}} onPress={() => handleSubmit(loginModel)}>
                    <Text style={styles.ButtonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{...styles.Button, backgroundColor: darkTheme ? '#4a4a4a' :"#327ba8"}} onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.ButtonText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{...styles.GoogleButton, backgroundColor: darkTheme ? '#0e4f0c' :"#0e4f0c"}}
                    onPress={async () => handleGoogle()}
                >
                    <Image
                    source={require('../../assets/google.png')}
                    style={{width: '20%', height: "90%", marginRight: '3%', marginLeft: '5%', marginTop:"1%", borderRadius: 50}}
                    resizeMode="stretch"
                    />
                    <Text style={styles.GoogleText}>Log in with Google</Text>
                </TouchableOpacity>
            </View>
            <Modal
            visible={isVisible}
            animationType='slide'
            transparent={true}
            >
                <View style={styles.Modal}>
                    <TextInput
                    placeholder="+1 999 999 9999"
                    autoFocus
                    autoCompleteType="tel"
                    keyboardType="phone-pad"
                    textContentType="telephoneNumber"
                    onChangeText={(number) => setPhoneNumber(number)}
                    />
                    <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={firebaseConfig}
                    attemptInvisibleVerification={true}
                    />
                    <TouchableOpacity onPress={async() => {
                        try {
                            const phoneProvider = new firebase.auth.PhoneAuthProvider();
                            const verificationId = await phoneProvider.verifyPhoneNumber(
                                phoneNumber,
                                recaptchaVerifier.current
                            );
                            setVerificationId(verificationId);
                            alert('Verification code has been sent to your phone.')
                            
                        } catch (err) {
                            alert(`Error: ${err.message}`);
                        }
                    }}>
                        <Text>Send verification code</Text>
                    </TouchableOpacity>
                    <TextInput
                    value={verificationCode}
                    onChangeText={(code) => setVerificationCode(code)}
                    />
                    <TouchableOpacity onPress={async () => {
                        try {
                            const credential = firebase.auth.PhoneAuthProvider.credential(
                            verificationId,
                            verificationCode
                            );
                            const userInfo = await firebase.auth().signInWithCredential(credential);
                            const currentUser = await firebase.auth().currentUser
                            if (userInfo.additionalUserInfo?.isNewUser) {
                                firebase.database().ref('/history/' + currentUser?.uid).set({
                                    email: result.user.email,
                                    logged: new Date()
                                })
                            } else {
                                firebase.database().ref('/history/' + currentUser?.uid).update({
                                    email: result.user.email,
                                    last_logged: new Date()
                                })
                            }
                            alert('Phone authentication successful 👍');
                            axios({
                                method: 'post',
                                url: 'http://10.0.2.2:8000/api/google',
                                data: result.user,
                            })
                                .then(resp => {
                                    if (resp.data != 'no such user') {
                                        setIsVisible(false)
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
                        } catch (err) {
                            alert(`Error: ${err.message}`);
                        }
                    }}
                    >
                        <Text>Confirm verification code</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsVisible(false)}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
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
    Modal: {
        marginTop: '10%',
        height: Dimensions.get('screen').height - 200,
        width: '80%',
        borderWidth: 1,
        borderRadius: 20,
        color: 'grey',
        alignSelf: 'center',
        backgroundColor: 'white',
    },
})


export default Login;