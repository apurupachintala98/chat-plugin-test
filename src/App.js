import './App.css';
import Dashboard from '../src/components/Dashboard';
import logo from '../src/images/logo.png';
import user from '../src/images/user.png';
import chatbot from '../src/images/chatbot.png';

function App() {
  return (
    <div >
    <Dashboard
    logo={logo}
    themeColor="#1a3673"
    title="Chat Assistant"
    newChatButtonLabel="New Chat"
    apiPath="http://10.126.192.122:8001/get_llm_response"
    sqlUrl="http://localhost:8000/run_sql_query/"
    appCd="Chat_bot"
    chatbotImage={chatbot}
    userImage={user}
    chatInitialMessage= "Hello there, I am your Chat Assistant. How can I help you today?" 
    customStyles={{
      container: {}, // Customize the container background
        appBar: {},             // Remove AppBar shadow
        logo: {},       // Custom logo style
        drawer: {}, // Custom drawer border
        newChatButton: {},    // Customize the New Chat button
        main: {},                 // Customize the main content padding
        chat: {
          inputContainer: {},      // Custom styles for the input container
          input: {},            // Custom styles for the input text
          chatContainer: {} // Customize chat container background
        }
    }}
  />
    </div>
  );
}

export default App;
