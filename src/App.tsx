import './App.css'
import { api } from './api/axios'

function App() {

  api.get('/leads')
   .then(response => {
    console.log(response.data);
   })

  return (
    <>
      
    </>
  )
}

export default App
