// import React, {useEffect} from 'react';
// import { Avatar, Box, Typography, Paper } from '@mui/material';
// import chatbot from '../images/chatbot.png';
// import user from '../images/user.png';
// import hljs from 'highlight.js/lib/core';
// import sql from 'highlight.js/lib/languages/sql';
// import 'highlight.js/styles/github.css'; // You can choose any theme

// hljs.registerLanguage('sql', sql);

// const ChatMessage = ({ chatLog,chatbotImage, userImage, showResponse, storedResponse }) => {
//   useEffect(() => {
//     // Apply syntax highlighting when messages change
//     hljs.highlightAll();
//   }, [chatLog]);
//   return (
//     <Box sx={{ width: '100%', padding: '10px 0' }}>
//       {chatLog.map((chat, index) => (
//         <Box
//           key={index}
//           sx={{
//             display: 'flex',
//             justifyContent: chat.role === 'assistant' ? 'flex-start' : 'flex-end',
//             marginBottom: '10px',
//           }}
//         >
//           <Paper
//             elevation={2}
//             sx={{
//               backgroundColor: chat.role === 'assistant' ? '#fff' : '#e0f7fa',
//               padding: '12px',
//               transition: 'width 0.3s ease',
//               borderRadius: '15px',
//               maxWidth: '80%', // Limits width to 80% of container
//               width: 'fit-content',
//               alignSelf: chat.role === 'assistant' ? 'flex-start' : 'flex-end', // Align messages based on role
//               boxShadow: '0px 0px 7px #898080',
//               color: '#1a3673',
//             }}
//           >
//             <Box
//               sx={{
//                 display: 'flex',
//                 justifyContent: chat.role === 'assistant' ? 'flex-start' : 'flex-end',
//                 marginBottom: '10px',
//               }}
//             >
//               {chat.role === 'assistant' ? (
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                   <Avatar
//                     src={chatbot}
//                     alt="Chatbot"
//                     sx={{ mr: 2, borderRadius: '50%', width: 32, height: 32 }}
//                   />
//                   <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 'bold' }}>
//                     {/* {chat.content} */}
//                     {chat.isSQLResponse ? (
//                       <pre>
//                         <code className="sql">{chat.content}</code>
//                       </pre>
//                     ) : (
//                       chat.content
//                     )}
//                   </Typography>
//                 </Box>
//               ) : (
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                   <Typography variant="body2" sx={{ fontSize: 14, mr: 2, fontWeight: 'bold' }}>
//                     {chat.content}
//                   </Typography>
//                   <Avatar
//                     src={user}
//                     alt="User"
//                     sx={{ borderRadius: '50%', width: 32, height: 32 }}
//                   />
//                 </Box>
//               )}
//             </Box>
//           </Paper>
//         </Box>
//       ))}
//     </Box>
//   );
// };

// export default ChatMessage;

import React, { useEffect } from 'react';
import { Avatar, Box, Typography, Paper } from '@mui/material';
import chatbot from '../images/chatbot.png';
import user from '../images/user.png';
import hljs from 'highlight.js/lib/core';
import sql from 'highlight.js/lib/languages/sql';
import 'highlight.js/styles/github.css';

hljs.registerLanguage('sql', sql);

const ChatMessage = ({ chatLog, chatbotImage, userImage, showResponse, storedResponse }) => {
  useEffect(() => {
    hljs.highlightAll();
  }, [chatLog, showResponse]);

  return (
    <Box sx={{ width: '100%', padding: '10px 0' }}>
      {chatLog.map((chat, index) => (
        <Box key={index} sx={{ display: 'flex', justifyContent: chat.role === 'assistant' ? 'flex-start' : 'flex-end', marginBottom: '10px' }}>
          <Paper elevation={2} sx={{ backgroundColor: chat.role === 'assistant' ? '#fff' : '#e0f7fa', padding: '12px', borderRadius: '15px', maxWidth: '80%', width: 'fit-content', boxShadow: '0px 0px 7px #898080', color: '#1a3673' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {chat.role === 'assistant' ? (
                <Avatar src={chatbotImage || chatbot} alt="Chatbot" sx={{ mr: 2, width: 32, height: 32 }} />
              ) : (
                <Avatar src={userImage || user} alt="User" sx={{ borderRadius: '50%', width: 32, height: 32 }} />
              )}
              <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 'bold' }}>
                {chat.isSQLResponse ? (
                  <pre><code className="sql">{chat.content}</code></pre>
                ) : (
                  chat.content
                )}
              </Typography>
            </Box>
          </Paper>
        </Box>
      ))}

      {/* Conditionally render the stored SQL response as an assistant message */}
      {showResponse && storedResponse && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
          <Paper elevation={2} sx={{ backgroundColor: '#fff', padding: '12px', borderRadius: '15px', maxWidth: '80%', width: 'fit-content', boxShadow: '0px 0px 7px #898080', color: '#1a3673' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={chatbotImage || chatbot} alt="Chatbot" sx={{ mr: 2, width: 32, height: 32 }} />
              <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 'bold' }}>
                <pre><code className="sql">{storedResponse}</code></pre>
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default ChatMessage;
