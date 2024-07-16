import { useState } from "react";
import Body from "./components/Body";
import { TodoContext } from "./context";

function App() {

  const [todos,setTodos] = useState({})
  return (
    <div>
      <TodoContext.Provider value={{todos,setTodos}}>
        <Body/>
      </TodoContext.Provider>
    </div>
  );
}

export default App
