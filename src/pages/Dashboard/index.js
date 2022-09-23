import { useState, useEffect } from "react";
import {AuthContext} from "../../contexts/auth"
import Header from '../../components/Header/header';
import Title from '../../components/Title/index';
import './dashboard.css'
import {FiMessageSquare, FiPlus , FiSearch , FiEdit2} from 'react-icons/fi';
import {Link } from 'react-router-dom'
import {format} from 'date-fns'
import firebase from "../../services/firebaseConnection";

import Modal from "../../components/Modal";

const listRef = firebase.firestore().collection('chamados').orderBy('created','desc');

export default function Dashboard(){

  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setloadingMore] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setlastDocs] = useState('');

  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();

  useEffect(() =>{
    
    loadingChamados();

    return() => {

    }
  },[]);
  
  async function loadingChamados(){
    await listRef.limit(5)
    .get()
    .then((snapshot) =>{
      updateState(snapshot)
    })
    .catch((error) =>{
      console.log(error);
      setloadingMore(false);
    })
    setLoading(false);
  }


  async function updateState(snapshot){
    const isCollectionEmpty = snapshot.size === 0;

    if(!isCollectionEmpty){
      let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            assunto: doc.data().assunto,
            cliente: doc.data().cliente,
            clienteId: doc.data().clienteId,
            created: doc.data().created,
            createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
            status: doc.data().status,
            complemento: doc.data().complemento
          })
        });
        
        const lastDoc = snapshot.docs[snapshot.docs.length -1]; //ultimo registro da lista

        setChamados(chamados =>[...chamados, ...lista]);
        setlastDocs(lastDoc);
    }
    else{
      setIsEmpty(true);
    }
    setloadingMore(false);
  }

  async function handleMore(){
    setloadingMore(true);
    await listRef.startAfter(lastDocs).limit(5)
    .get()
    .then((snapshot)=>{
      updateState(snapshot)
    })
  }

  function togglePostModal(item){
    setShowPostModal(!showPostModal);
    setDetail(item);
  }


  if(loading){
    return(
      <div>
        <Header/>
        <div className="content">
          <Title name ="Atendimento">
            <FiMessageSquare size={25} /> 
          </Title>
          <div className="container dashboard">
            <span>Buscando chamados...</span>
          </div>
        </div>
      </div>
    )
  }

  return(
      <div>
      <Header/>
      <div className="content">
        <Title name ="Atendimento">
          <FiMessageSquare size={25} /> 
        </Title>

        {chamados.length === 0 ? (
          <div className='container dashboard'>
            <span>Nenhum chamado registrado </span>

            <Link to="/new" className="new">
              <FiPlus size={25} color="#fff" />
              Novo chamado
            </Link>
          </div>
          ) : (
          <>
          <Link to="/new" className="new">
            <FiPlus size={25} color="#fff" />
            Novo chamado
          </Link>

          <table>
            <thead>
              <tr>
                <th scope = "col">Cliente</th>
                <th scope = "col">Assusto</th>
                <th scope = "col">Status</th>
                <th scope = "col">Cadastrado em</th>
                <th scope = "col">#</th>
              </tr>
            </thead>
            <tbody>

              {chamados.map((item, index) =>{
                return(
                  <tr key={index}>
                    <td data-label ="Cliente">{item.cliente}</td>
                    <td data-label ="Assunto"> {item.assunto}</td>
                    <td data-label ="Status"> 
                      <span className="badge" style={{background: item.status === 'Aberto' ? '#5cb85c' : '#999'}}> {item.status}</span>
                    </td>
                    <td data-label ="Cadastrado">{item.createdFormated}</td>
                    <td data-label ="#">
                      <button className="action" style={{backgroundColor: '#3583f6'}} onClick={() =>{togglePostModal(item)}}>
                        <FiSearch color="fff" size={17} />
                      </button>
                      <Link className="action" style={{backgroundColor: '#f6a935'}} to={`/new/${item.id}`}>
                        <FiEdit2 color="fff" size={15} />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {loadingMore && <h3 style={{textAlign: 'center', marginTop:15 }}>Buscando chamados...</h3>}
          {!loadingMore && !isEmpty && <button className="btn-more" onClick={() =>{handleMore()}}>Buscar mais</button>}
          </>
        )}
        
      </div>
        {showPostModal && (
          <Modal 
            conteudo={detail}
            close={togglePostModal}
          />
        )}
      </div>
    )
  }