import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Alert } from 'flowbite-react';
import { FaTelegramPlane } from 'react-icons/fa';
import HashLoader from 'react-spinners/HashLoader';
import ChatMessage from './ChatMessage';
import Feedback from './Feedback';
import { Box, Grid, TextField, Button, IconButton, Typography, InputAdornment, Toolbar, useTheme, useMediaQuery, Modal, Backdrop, Fade } from '@mui/material';
import parseMessageContent from './parseMessageContent';

function UserChat(props) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const {
    chatLog, setChatLog,
    themeColor,
    responseReceived, setResponseReceived,
    error, setError,
    chatInitialMessage,
    isLoading, setIsLoading,
    successMessage, setSuccessMessage,
    showInitialView, setShowInitialView,
    requestId, setRequestId, apiPath, appCd, customStyles = {}, chatbotImage, userImage
  } = props;

  const endOfMessagesRef = useRef(null);
  const [apiResponse, setApiResponse] = useState(null); // New state for storing API response
  const [input, setInput] = useState('');
  const layoutWidth = isSmallScreen ? '100%' : isMediumScreen ? '80%' : '70%';
  const inactivityTimeoutRef = useRef(null); // Ref for the inactivity timeout
  const [sessionActive, setSessionActive] = useState(true); // State to track session activity
  const [openPopup, setOpenPopup] = useState(false);
  const INACTIVITY_TIME = 10 * 60 * 1000;
  const [serverError, setServerError] = useState(null);

  useLayoutEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog]);

  // Handle session end due to inactivity
  const handleSessionEnd = () => {
    setSessionActive(false);
    setChatLog([...chatLog, { role: 'assistant', content: 'Session has ended due to inactivity.' }]);
    setOpenPopup(true); // Show the popup
  };


  // Start or reset the inactivity timer
  const resetInactivityTimeout = () => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }

    inactivityTimeoutRef.current = setTimeout(() => {
      handleSessionEnd(); // End session after 30 minutes of inactivity
    }, INACTIVITY_TIME);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!input.trim()) return;
  //   if (!appCd.trim() || !requestId.trim()) {
  //     setError('Please provide valid app_cd and request_id.');
  //     return;
  //   }
  //   const newMessage = { role: 'user', content: input };
  //   const newChatLog = [...chatLog, newMessage];
  //   setChatLog(newChatLog);
  //   setInput('');
  //   setIsLoading(true);
  //   setError('');
  //   setShowInitialView(false);
  //   setServerError(null);


  //   try {
  //     let botMessage;
  //     const url = `${apiPath}?app_cd=${appCd}&request_id=${requestId}`;
  //     const response = await fetch(url, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify([newMessage]),
  //     });
  //     if (!response.ok) {
  //       if (response.status >= 500) {
  //         throw new Error('Server is unavailable. Please try again later.');
  //       } else {
  //         throw new Error('Error communicating with the server.');
  //       }
  //     }
  //     const data = await response.json();
  //     setApiResponse(data);
  //     const convertToString = (input) => {
  //       if (typeof input === 'string') {
  //         return input;
  //       } else if (Array.isArray(input)) {
  //         return input.map(convertToString).join(', ');
  //       } else if (typeof input === 'object' && input !== null) {
  //         return Object.entries(input)
  //           .map(([key, value]) => `${key}: ${convertToString(value)}`)
  //           .join(', ');
  //       }
  //       return String(input);
  //     };

  //     let modelReply = 'No valid reply found.';
  //     if (typeof data.modelreply === 'object' && data.modelreply !== null) {
  //       // If modelreply is an object, keep it as is for table rendering
  //       botMessage = {
  //         role: 'assistant',
  //         content: data.modelreply, // Keep it as an object for table rendering
  //         isTable: true,
  //       };
  //     } else {
  //       // For non-object replies, use convertToString logic
  //       let modelReply = 'No valid reply found.';
  //       if (data.modelreply) {
  //         modelReply = convertToString(data.modelreply); // Convert modelreply to string
  //       }

  //       botMessage = {
  //         role: 'assistant',
  //         content: modelReply, // Store the final reply as a string
  //         isTable: false, // Indicate it's not a table
  //       };
  //     }
  //     setChatLog([...newChatLog, botMessage]);
  //   } catch (err) {
  //     const errorMessage = {
  //       role: 'assistant',
  //       content: 'Unable to fetch data from the server  ...', // Error message
  //   };
  //   // Update the chat log with the error message
  //   setChatLog([...newChatLog, errorMessage]); // Add error message to chat log
  //   console.error(err);
  //     console.error(err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Handle focus or input changes

  async function handleSubmit(e) {
    e.preventDefault();

    // Prevent empty messages
    if (!input.trim()) return;

    // Validate appCd and requestId
    if (!appCd.trim() || !requestId.trim()) {
      setError('Please provide valid app_cd and request_id.');
      return;
    }

    const newMessage = {
      role: 'user',
      content: input,
    };
    const newChatLog = [...chatLog, newMessage]; // Add user's message to chat log
    setChatLog(newChatLog);
    setInput(''); // Clear the input field
    setIsLoading(true); // Set loading state
    setError(''); // Clear any previous error
    setShowInitialView(false);
    resetInactivityTimeout(); // Reset the inactivity timer on user action
    try {
      // Dynamic API URL based on user inputs
      const url = `${apiPath}?app_cd=${appCd}&request_id=${requestId}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([newMessage]),
      });
      // Check if response is okay
      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error('Server error, please try again later.');
        } else if (response.status === 404) {
          throw new Error('API endpoint not found.');
        } else if (response.status === 400) {
          throw new Error('Bad request. Please check the input parameters.');
        } else {
          throw new Error('Network response was not ok');
        }
      }

      const data = await response.json();
      setApiResponse(data);
      // const convertToString = (input) => {
      //   if (typeof input === 'string') {
      //     return input;
      //   } else if (Array.isArray(input)) {
      //     return input.map(convertToString).join(', ');
      //   } else if (typeof input === 'object' && input !== null) {
      //     return Object.entries(input)
      //       .map(([key, value]) => `${key}: ${convertToString(value)}`)
      //       .join(', ');
      //   }
      //   return String(input);
      // };
      const modelReply = data?.modelreply || 'No valid reply found';
      const parsedMessageContent = parseMessageContent(modelReply);      
      const botMessage = {
        role: 'assistant',
        content: parsedMessageContent,
      };

      setChatLog([...newChatLog, botMessage]); // Update chat log with assistant's message

    } catch (err) {
      // Enhanced error messaging
      setError(`Error: ${err.message || 'Error communicating with backend'}`);
      console.error(err);
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  }
  const handleInputFocusOrChange = () => {
    setShowInitialView(false);
    resetInactivityTimeout();
  };

  useEffect(() => {
    resetInactivityTimeout();
    return () => {
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    };
  }, []);

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: layoutWidth,
      flexDirection: 'column',
      margin: 'auto', ...customStyles.container
    }}>

      {showInitialView && (
        <>
          <div
            style={{
              width: '40px',
              height: 'auto',
              overflow: 'hidden',
              marginRight: 2,
            }}
          >
            <img
              src={chatbotImage}
              alt="Chatbot"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
          <Box
            component="p"
            sx={{
              marginTop: '10px',
              fontSize: '16.5px',
              fontWeight: 600,
              color: themeColor,
              textAlign: 'center',
              marginBottom: '19%',
              ...customStyles.initialPrompt
            }}
          >
            {chatInitialMessage}

          </Box>

        </>
      )}

      <Box sx={{
        flex: 1,
        width: '100%',
        overflowY: 'auto',
        maxHeight: '73vh',
        padding: '10px', ...customStyles.chatContainer
      }}>
        <ChatMessage chatLog={chatLog} chatbotImage={chatbotImage} userImage={userImage} />
        <div ref={endOfMessagesRef} />
        {isLoading && <HashLoader color={themeColor} size={30} aria-label="Loading Spinner" data-testid="loader" />}
        {/* {responseReceived && <Feedback />} */}
        {successMessage && <Alert color="success"><span>{successMessage}</span></Alert>}
      </Box>

      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '100%',
        flexDirection: 'column', ...customStyles.inputContainer
      }}>
        <Grid container spacing={2} sx={{ width: '100%', maxWidth: '100%', position: 'fixed', bottom: '50px', left: '67%', transform: 'translateX(-50%)', width: '70%', marginLeft: '8px', flexDirection: 'column' }}>
          <Grid item xs={12} sm={6}>
            <form onSubmit={handleSubmit} style={{ width: '100%', backgroundColor: '#fff', boxShadow: '0px -2px 5px rgba(0, 0, 0, 0.1)', ...customStyles.form }}>
              <TextField
                fullWidth
                placeholder="What can I help you with..."
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  handleInputFocusOrChange(); // Ensure elements disappear when typing
                }}
                onFocus={handleInputFocusOrChange}
                inputProps={{ maxLength: 400 }}
                InputProps={{
                  sx: {
                    '& .MuiInputBase-input': {
                      padding: '12px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      color: themeColor,
                    },
                    '& .MuiInputAdornment-root button': {
                      color: themeColor,
                    },
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit">
                        <FaTelegramPlane className="h-6 w-6" color={themeColor} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </Grid>
        </Grid>
      </Box>

      <Modal open={openPopup}
        onClose={() => setOpenPopup(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        <Fade in={openPopup}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
          }}>
            <Typography variant="h6">Session Ended</Typography>
            <Typography sx={{ mt: 2 }}>Your session has ended due to 10 minutes of inactivity.</Typography>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default UserChat;
