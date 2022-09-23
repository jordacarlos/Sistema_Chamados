import Header from '../../components/Header/header';
import Title from '../../components/Title/index';
import {FiPlus} from 'react-icons/fi';
import { useState, useEffect, useContext } from 'react';
import {AuthContext} from "../../contexts/auth"
import {useHistory,useParams} from 'react-router-dom'

import firebase from '../../services/firebaseConnection';
import { toast } from "react-toastify";


import './new.css';

export default function New(){

    const {id} = useParams();
    const history =  useHistory();

    const [loadcustomers, setLoadCustomers] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [customersSelected, setCustomersSelected] = useState(0);
    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [complemento, setComplemento] = useState('');

    const [idCustomer, setIdCustomer] = useState(false)
    

    const {user} = useContext(AuthContext);

    useEffect(() =>{
        async function loadCustomers(){
            await firebase.firestore().collection('customers')
            .get()
            .then((snapshot) =>{
            let lista=[];

            snapshot.forEach((doc)=>{
                lista.push({
                    id: doc.id,
                    nomeFantasia: doc.data().nomeFantasia
                })
            });

            if(lista.length === 0){
                console.log("erro nas empresas");
                setCustomers([ {id:'1', nomeFantasia: ''} ]);
                setLoadCustomers(false);
                return;
            }

            setCustomers(lista);
            setLoadCustomers(false);

            
            if(id){
                loadId(lista);
            }


            })
            .catch((error) =>{
                alert('Erro', error)
                setLoadCustomers(false);
                setCustomers([ {id:'1', nomeFantasia: ''} ]);
            })
        }

        loadCustomers();
    },[id])

   async function loadId(lista){
    await firebase.firestore().collection('chamados')
    .doc(id).get()
    .then((snapshot) =>{
        setAssunto(snapshot.data().assunto);
        setStatus(snapshot.data().status);
        setComplemento(snapshot.data().complemento);
        
        let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
        setCustomersSelected(index);
        setIdCustomer(true);
    })
    .catch((error) =>{
        console.log("Erro no id")
        setIdCustomer(false);
    })
    }


    async function handleRegister(e){

        e.preventDefault();

        const bd = 1
        if(bd === 1){
            toast.error("Inclusão foi desabilitado para não sobrecarregar o Firebase grátis");
        }else{
            if(idCustomer){
                await firebase.firestore().collection('chamados').doc(id)
                .update({
                    cliente: customers[customersSelected].nomeFantasia,
                    clienteId: customers[customersSelected].id,
                    assunto: assunto,
                    status: status,
                    complemento: complemento,
                    userId: user.uid
                })
                .then(() =>{
                    toast.success("Chamado editado com sucesso")
                    setCustomersSelected(0);
                    setComplemento('');
                    history.push('/dashboard')
                })
                .catch((error) =>{
                    toast.error("Erro na alteração do chamado")
                })
                return;
            }
            
            await firebase.firestore().collection('chamados')
            .add({
                created: new Date(),
                cliente: customers[customersSelected].nomeFantasia,
                clienteId: customers[customersSelected].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.uid
            })
            .then(() =>{
                toast.success("Chamado criado!");
                setComplemento('');
                setCustomersSelected(0);
            })
            .catch((error) =>{
                toast.error("Erro na criação do chamado");
            })
        }
    }
    //torca assunto
    function handleChangeSelect(e){
        setAssunto(e.target.value);
    }
    //torca status
    function handleOptionChange(e){
        setStatus(e.target.value);
    }
    //troca de cliente
    function handleChangeCustomers(e){
        setCustomersSelected(e.target.value);
    }


    return(
        <div>
            <Header/>
            <div className='content'>
                <Title name = "Novo chamado">
                    <FiPlus size={25} />
                </Title>
                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>
                    <label>Clientes:</label>

                    {loadcustomers ? (
                        <input type="text" disabled={true} value="Carregando clientes..." />
                    ) : (
                        <select value={customersSelected} onChange={handleChangeCustomers}>
                            {customers.map((item, index) =>{
                                return(
                                    <option key={item.id} value={index}>
                                         {item.nomeFantasia}
                                    </option>
                                )
                            })}
                        </select>
                    )}
                    <label>Assunto:</label>
                    <select value={assunto} onChange={handleChangeSelect}> 
                        <option value="Suporte">Suporte</option>
                        <option value="Visita tecnica">Visita Tecnica</option>
                        <option value="Financeiro">Financeiro</option>
                    </select>

                    <label>Status:</label>
                    <div className='status'>
                        <input type="radio" name="radio" value="Aberto" onChange={handleOptionChange} checked={status === 'Aberto'} />
                        <span>Em aberto</span>
                        <input type="radio" name="radio" value="Progresso" onChange={handleOptionChange} checked={status === 'Progresso'} />
                        <span>Progresso</span>
                        <input type="radio" name="radio" value="Atendido" onChange={handleOptionChange} checked={status === 'Atendido'} />
                        <span>Atendido</span>
                    </div>

                    <label>Complemento:</label>
                    <textarea type='type' placeholder="Descreva seu problema" value={complemento} onChange={(e)=>setComplemento(e.target.value)} />

                    <button type='submit'>Registrar</button>

                    </form>
                </div>
            </div>
        </div>
    )
}