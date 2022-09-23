import { useState, createContext, useEffect } from "react";
import firebase from "../services/firebaseConnection";
import { toast } from "react-toastify";

export const AuthContext = createContext({});

function AuthProvider({children}){
    const [user,setUser] = useState(null);
    const [loadingAuth, setloadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{

        function loadStorage(){
            const storageUser = localStorage.getItem('SistemaUser')

            if(storageUser){
                setUser(JSON.parse(storageUser));
                setLoading(false)
            }
            setLoading(false);
        }
        loadStorage();
    }, [])

///cadastro usuario
async function signUp(email, password, name){
    setloadingAuth(true);

    await firebase.auth().createUserWithEmailAndPassword(email, password)
    .then( async (value) =>{
        let uid = value.user.uid;

        await firebase.firestore().collection('users')
        .doc(uid).set({
            nome: name,
            avatarUrl: null,
        })
        .then(() =>{
            let data = {
                uid: uid,
                nome: name,
                email: value.user.email,
                avatarUrl: null
            };
            setUser(data);
            storageUser(data);
            setloadingAuth(false);
            toast.success("Bem vindo ao sistema");
        })
    })
    .catch((error) =>{
        toast.error("Vish! Temos um erro" + error);
        setloadingAuth(false);
    })
}

function storageUser(data){
    localStorage.setItem('SistemaUser', JSON.stringify(data))
}

///log out usuario
async function signOut(){
    await firebase.auth().signOut();
    localStorage.removeItem('SistemaUser');
    setUser(null);
}
// Login usuario
async function signIn(email, password){
    setloadingAuth(true);

    await firebase.auth().signInWithEmailAndPassword(email, password)
    .then( async (value) =>{
        let uid = value.user.uid;
        const userProfile = await firebase.firestore().collection('users')
        .doc(uid).get();

        let data ={
            uid: uid,
            nome: userProfile.data().nome,
            avatarUrl: userProfile.data().avatarUrl,
            email: value.user.email
        };

        setUser(data);
        storageUser(data);
        setloadingAuth(false);
        toast.success("Bem vindo ao sistema");
    })
    .catch((error) =>{
        toast.error("Vish! Temos um erro");
        setloadingAuth(false);
    })
}

    return(
        <AuthContext.Provider 
            value={{signed: !!user, 
            user, 
            loading, 
            signUp,
            signOut,
            signIn,
            loadingAuth,
            setUser,
            storageUser
            }}
        > 
            {children}
        </AuthContext.Provider>    
    )
}
// !! converte para boolean
export default AuthProvider