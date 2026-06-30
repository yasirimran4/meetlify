import axios from 'axios'
import { useState } from 'react'
function App() {

  const [status,setStatus] = useState("")

  const fetchData =async () => {
    try {
      const data = await axios.get("${import.meta.env.VITE_API_URL}/health")
      console.log(data)
      setStatus(data)
    } catch (error) {
     console.log(error) 
    }
  }
  return (
    <>
       <div>
        <h1>Yasir Imran</h1>
        <button onClick={fetchData}>Click</button>
        {status & <p>status</p>}
       </div>
    </>
  )
}

export default App
