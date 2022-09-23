import './customers.css'
import Header from '../../components/Header/header';
import Title from '../../components/Title/index';
import {FiUser} from 'react-icons/fi';
import { useState } from 'react';
import { toast } from "react-toastify";
import firebase from '../../services/firebaseConnection';


export default function Customers(){

    const [nomeFantasia, setnomeFantasia] = useState();
    const [cnpj, setcnpj] = useState();
    const [endereco, setendereco] = useState();
    

   async function handleAdd(e){
    e.preventDefault();
        const bd = 1
        if(bd === 1){
            toast.error("Inclusão foi desabilitado para não sobrecarregar o Firebase grátis");
        }
        else{
            if(nomeFantasia !== '' && cnpj !== '' && endereco !== ''){
                await firebase.firestore().collection('customers')
                .add({
                    nomeFantasia: nomeFantasia,
                    cnpj: cnpj,
                    endereco: endereco
                })
                .then(() =>{
                    setnomeFantasia('');
                    setcnpj('');
                    setendereco('');
                    toast.info("Empresa cadastrada com sucesso")
                })
                .catch((error) =>{
                    toast.error("Erro no cadastro da empresa");
                })
            }
            else{
                toast.error("Insira as informações");
            }
        }
    }

    return(
    <div className=''>
        <Header />
        <div className='content'>
        <Title name="Clientes">
            <FiUser size={25} /> 
        </Title>  
        <div className='container'>
            <form className='form-profile customers' onClick={handleAdd}>

            <label>Nome fantasia</label>
            <input type="text" placeholder='Nome da empresa' value={nomeFantasia} onChange ={(e) => setnomeFantasia(e.target.value)} ></input>

            <label>CNPJ</label>
            <input type="text" placeholder='CNPJ da empresa' value={cnpj} onChange ={(e) => setcnpj(e.target.value)} ></input>

            <label>Endereço</label>
            <input type="text" placeholder='Endereço da empresa' value={endereco} onChange ={(e) => setendereco(e.target.value)} ></input>

            <button type='submit'>Cadastrar</button>

            </form>
        </div>  
        </div>
    </div>
)
}