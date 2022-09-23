import './profile.css';
import firebase from '../../services/firebaseConnection';
import Header from '../../components/Header/header';
import Title from '../../components/Title/index';
import {FiSettings, FiUpload} from 'react-icons/fi';
import avatar from '../../assets/avatar.png'
import {useContext, useState } from 'react';
import {AuthContext} from '../../contexts/auth';
import { toast } from "react-toastify";

export default function Profile(){

    const { user,signOut,loadingAuth,setUser,storageUser} = useContext(AuthContext)

    const [nome, setNome] = useState( user && user.nome);
    const [email, setEmail] = useState(user && user.email);
    const [avatarUrl, setavatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setimageAvatar] = useState(null);

    function handleFile(e){

        if(e.target.files[0]){
            const image = e.target.files[0]
            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setimageAvatar(image)
                setavatarUrl(URL.createObjectURL(e.target.files[0]))
            }else{
                toast.error("Imagem apenas em .jpeg ou .png")
                setimageAvatar(null)
                return null
            }
        }
    }

    async function handleUpload(){
        const currentUid = user.uid;
        
        const uploadTask = await firebase.storage()
        .ref(`image/${currentUid}/${imageAvatar.name}`)
        .put(imageAvatar)
        .then( async() =>{
            toast.success("FOTO ENVIADA COM SUCESSO");
            await firebase.storage().ref(`image/${currentUid}`)
            .child(imageAvatar.name).getDownloadURL()
            .then( async(url) =>{
                let urlFoto = url

                await firebase.firestore().collection('users')
                .doc(user.uid)
                .update({
                    avatarUrl: urlFoto,
                    nome: nome
                })
                .then(() =>{
                    let data = {
                        ...user,
                        avatarUrl: urlFoto,
                        nome:nome
                    };
                    setUser(data);
                    storageUser(data);
                })
            });
        });
    }



    async function handleSave(e){
        e.preventDefault();
        const bd = 1
        if(bd === 1){
            toast.error("Update foi desabilitado para subir o projeto no Github");
        }
        else{

            // Enviando nome atualizado
            if(imageAvatar === null && nome !== ''){
                await firebase.firestore().collection('users')
                .doc(user.uid)
                .update({
                    nome: nome
                })
                .then(()=>{
                    let data = {
                    ...user,
                    nome: nome
                    };
                    setUser(data);
                    storageUser(data);
                })
            }

            else if(nome !== '' && imageAvatar !== null){
                handleUpload()
            }
        }
    }

    return(
        <div>
            <Header />
            <div className='content'>
                <Title name="Meu perfil">
                    <FiSettings size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleSave}>
                        <label className='label-avatar'>
                        <span>
                            <FiUpload color="#fff" size={25} />
                        </span>
                        <input type="file" accpet="image/*" onChange={handleFile} /><br />
                        { avatarUrl === null ? 
                            <img src={avatar} width="250" height="250" alt="Foto perfil usuário" />
                            :
                            <img src={avatarUrl} width="250" height="250" alt="Foto perfil usuário" />
                        }   
                        </label>
                        <label>Nome</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                        <label>Email</label>
                        <input type="text" value={email} disabled={true} />
                        <button type='submit'>Salvar</button>
                    </form>
                </div>
                <div className='container'>
                    <button className='logout-btn' onClick={() => signOut()}>
                    {loadingAuth ? 'Carregando...' : 'Sair'}
                    </button>
                </div>
            </div>
        </div>
    )
}