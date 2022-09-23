
import {Link} from 'react-router-dom'
import {useState, useContext} from 'react'
import logo from '../../assets/logo.png'
import {AuthContext} from '../../contexts/auth'


function SignUp() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const {signUp, loadingAuth} = useContext(AuthContext);

  function handleSubmit(e){
    e.preventDefault();

    if(nome !== "" && email !== "" && password !==""){
      signUp(email, password, nome)
    }
    
  }

    return (
      <div className='container-center'>
         <div className='login'>
          <div className='login-area' >
            <img src={logo} alt="Sistema logo" />
          </div>
          <form onSubmit={handleSubmit}>
            <h1>Entrar</h1>
            <input type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} />
            <input type="text" placeholder="email@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">{loadingAuth ? 'Carregando...' : 'Acessar'}</button>
          </form>
          <Link to="/">Já tem uma conta?</Link>
         </div>
      </div>
    );
  }
  
  export default SignUp;