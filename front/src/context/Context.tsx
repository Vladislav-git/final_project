import React, {useContext, useState} from 'react';

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

const initialUser:User = {
    token: '',
    user: {
        post: {
            _id: '',
            user_name: '',
            user_img: '',
            user_id: '',
            post_text: '',
            post_img: '',
            post_video: '',
            like_number: 0,
            who_liked: [],
            comments: [],
            comment_number: 0
        },
        user_profile: '',
        _id: '',
        firstname: '',
        secondname: '',
        email: '',
        password: '',
        created_date: '',
        profile: '',
        friends: [],
        images: [],
        videos: [],
        avatar: '',
        chats: []
    }
}

const Context = React.createContext({darkTheme: false, context: initialUser});
const UpdateContext = React.createContext();

export function useC () {
    return useContext(Context)
}

export function useUpdateC () {
    return useContext(UpdateContext)
}


export function Provider ({children}:any) {

    const [darkTheme, setDarkTheme] = useState(false);
    const [context, setData] = useState(initialUser)
    

    function toggleTheme () {
        setDarkTheme(prevTheme => !prevTheme)
    }

    function updateData (data:User) {
        setData(prevData => data)
    }

    return (
        <Context.Provider value={{darkTheme, context}}>
            <UpdateContext.Provider value={{toggleTheme, updateData}}>
                {children}
            </UpdateContext.Provider>
        </Context.Provider>
    )
}