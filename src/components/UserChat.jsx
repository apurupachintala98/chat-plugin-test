import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Alert } from 'flowbite-react';
import { FaTelegramPlane } from 'react-icons/fa';
import HashLoader from 'react-spinners/HashLoader';
import ChatMessage from './ChatMessage';
import { Box, Grid, TextField, Button, IconButton, Typography, InputAdornment, Toolbar, useTheme, useMediaQuery, Modal, Backdrop, Fade, FormControlLabel, Checkbox } from '@mui/material';
import ChartModal from './ChartModal';
import BarChartIcon from '@mui/icons-material/BarChart';
import { format as sqlFormatter } from 'sql-formatter';
import hljs from 'highlight.js/lib/core';
import sql from 'highlight.js/lib/languages/sql';
import SuggestedPrompts from '../components/SuggestedPrompts';

hljs.registerLanguage('sql', sql);
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
    requestId, setRequestId, apiPath, sqlUrl, appCd, customStyles = {}, chatbotImage, userImage, handleNewChat, suggestedPrompts, showButton, setShowButton, showExecuteButton, setShowExecuteButton
  } = props;

  const endOfMessagesRef = useRef(null);
  const [apiResponse, setApiResponse] = useState(null); // New state for storing API response
  const [input, setInput] = useState('');
  const layoutWidth = isSmallScreen ? '100%' : isMediumScreen ? '80%' : '70%';
  const inactivityTimeoutRef = useRef(null); // Ref for the inactivity timeout
  const [sessionActive, setSessionActive] = useState(true); // State to track session activity
  const [openPopup, setOpenPopup] = useState(false);
  const INACTIVITY_TIME = 10 * 60 * 1000;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [storedResponse, setStoredResponse] = useState(''); // New state to store the response
  const [showResponse, setShowResponse] = useState(false);
  const [data, setData] = useState('');

  useLayoutEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog]);

  const handleGraphClick = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };
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

  async function handleSubmit(e) {
    e.preventDefault();

    // Prevent empty messages
    if (!input.trim()) return;
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
    setShowResponse(false);
    setShowButton(false);
    setShowExecuteButton(false);

    try {
      // Dynamic API URL based on user inputs
      const url = `${apiPath}?app_cd=${appCd}&request_id=${requestId}`;
      const response = await fetch(
        url,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([newMessage]),
        }
      );

      // Check if response is okay
      if (!response.ok) {
        let errorMessage = '';

        // Handle different status codes
        if (response.status === 404) {
          errorMessage = '404 - Not Found';
        } else if (response.status === 500) {
          errorMessage = '500 - Internal Server Error';
        } else {
          errorMessage = `${response.status} - ${response.statusText}`;
        }

        // // Display the image and error message
        const botMessage = {
          role: 'assistant',
          content: (
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <p style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>{errorMessage}</p>
            </div>
          ),
        };

        setChatLog([...newChatLog, botMessage]); // Update chat log with assistant's error message
        throw new Error(errorMessage); // Re-throw the error for logging purposes
      }

      const data = await response.json();
      setApiResponse(data);

      // Function to convert object to string (if needed)
      const convertToString = (input) => {
        if (typeof input === 'string') {
          return input;
        } else if (Array.isArray(input)) {
          // Recursively convert array items
          return input.map(convertToString).join(', ');
        } else if (typeof input === 'object' && input !== null) {
          // Convert key-value pairs
          return Object.entries(input)
            .map(([key, value]) => `${key}: ${convertToString(value)}`)
            .join(', ');
        }
        return String(input);
      };

      // Determine how to handle the response
      let isSQLResponse = false;
      let modelReply = 'No valid reply found.'; // Default message
      if (data.modelreply) {
        // Check if the response is a JSON array of objects
        if (Array.isArray(data.modelreply) && data.modelreply.every(item => typeof item === 'object')) {
          const columnCount = Object.keys(data.modelreply[0]).length;
          const rowCount = data.modelreply.length;
          // Convert to table-like format with borders for display
          modelReply = (
            <div style={{ display: 'flex', alignItems: 'start' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr>
                    {Object.keys(data.modelreply[0]).map((key) => (
                      <th key={key} style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.modelreply.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((val, colIndex) => (
                        <td key={colIndex} style={{ border: '1px solid black', padding: '8px' }}>{convertToString(val)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {(rowCount > 1 && columnCount > 1) && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<BarChartIcon />}
                  sx={{ display: 'flex', alignItems: 'center', padding: '8px 16px', marginLeft: '15px', width: '190px', fontSize: '10px', fontWeight: 'bold' }}
                  onClick={handleGraphClick}
                >
                  Graph View
                </Button>
              )}
            </div>
          );
        } else if (typeof data.modelreply === 'string') {
          const sqlRegex = /```sql([\s\S]*?)```/g;
          const parts = [];
          let lastIndex = 0;
          let match;

          // Split the response into SQL and text
          while ((match = sqlRegex.exec(data.modelreply)) !== null) {
            // Add the text before the SQL block
            if (match.index > lastIndex) {
              parts.push(
                <p key={`text-${lastIndex}`} style={{ margin: "8px 0" }}>
                  {data.modelreply.slice(lastIndex, match.index).trim()}
                </p>
              );
            }

            // Format the SQL block
            const sqlContent = match[1].trim();
            try {
              parts.push(
                <pre key={`sql-${match.index}`} style={{ margin: '8px 0' }}>
                  <code style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {sqlFormatter(sqlContent)}
                  </code>
                </pre>
              );
            } catch (err) {
              console.error("SQL Formatting Error:", err);
              parts.push(
                <pre key={`sql-${match.index}`} style={{ margin: '8px 0', color: 'red' }}>
                  {sqlContent}
                </pre>
              );
            }

            lastIndex = sqlRegex.lastIndex;
          }
          // if (lastIndex < data.modelreply.length) {
          //   parts.push(
          //     <p key={`text-${lastIndex}`} style={{ margin: "8px 0" }}>
          //       {data.modelreply.slice(lastIndex).trim()}
          //     </p>
          //   );
          // }

          if (lastIndex < data.modelreply.length) {
            const remainingContent = data.modelreply.slice(lastIndex).trim();
            if (/SELECT|WHERE|FROM/i.test(remainingContent)) {
              // Treat remaining content as SQL
              try {
                parts.push(
                  <pre key={`sql-remaining`} style={{ margin: '8px 0' }}>
                    <code style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {sqlFormatter(remainingContent)}
                    </code>
                  </pre>
                );
              } catch (err) {
                console.error("SQL Formatting Error:", err);
                parts.push(
                  <pre key={`sql-remaining`} style={{ margin: '8px 0', color: 'red' }}>
                    {remainingContent}
                  </pre>
                );
              }
            } else {
              // Add remaining text as-is
              parts.push(
                <p key={`text-${lastIndex}`} style={{ margin: "8px 0" }}>
                  {remainingContent}
                </p>
              );
            }
          }


          modelReply = (
            <div style={{ overflow: "auto", maxWidth: "100%", padding: "10px" }}>
              {parts}
            </div>
          );

          setStoredResponse(modelReply);
          setShowButton(true); // Show "Show SQL" button
          setShowExecuteButton(true); // Show "Execute SQL" button
        } else {
          // Otherwise, convert to string
          modelReply = convertToString(data.modelreply);
          const botMessage = { role: 'assistant', content: modelReply, isSQLResponse, };
          setChatLog([...newChatLog, botMessage]);
        }
      }
    } catch (err) {
      let fallbackErrorMessage = 'Error communicating with backend.';
      const errorMessage = {
        role: 'assistant',
        content: (
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <p style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>{fallbackErrorMessage}</p>
          </div>
        ),
      };

      setChatLog([...newChatLog, errorMessage]);
      setError('Error communicating with backend');
      console.error('Error:', err);
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

  const handleButtonClick = async () => {
    try {
      const sanitizeQuery = (query) => {
        if (typeof query !== 'string') {
          console.error('sanitizeQuery: Input is not a string.');
          return '';
        }
        let cleanedQuery = query
          .replace(/\n/g, ' ')
          .replace(/\s\s+/g, ' ')
          .replace(/WITH __prov AS \(.+?\),/g, '')
          .trim();

        return cleanedQuery;
      };
      const decodedStoredResponse = decodeURIComponent(storedResponse);
      if (typeof decodedStoredResponse !== 'string') {
        console.error('decodedStoredResponse is not a string');
      }
      const sanitizedQuery = sanitizeQuery(decodedStoredResponse);
      const encodedResponse = encodeURIComponent(sanitizedQuery);

      // const decodedStoredResponse = decodeURIComponent(storedResponse);
      // const encodedResponse = sanitizeQuery(decodedStoredResponse); // Encode the storedResponse
      const sqlQueryUrl = `${sqlUrl}?app_cd=${appCd}&request_id=${requestId}&exec_query=${encodedResponse}`;
      const response = await fetch(sqlQueryUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if response is okay
      if (!response.ok) {
        let errorMessage = '';

        // Handle different status codes
        if (response.status === 404) {
          errorMessage = '404 - Not Found';
        } else if (response.status === 500) {
          errorMessage = '500 - Internal Server Error';
        } else {
          errorMessage = `${response.status} - ${response.statusText}`;
        }

        // Create an error message object
        const errorMessageContent = {
          role: 'assistant',
          content: (
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <p style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>{errorMessage}</p>
            </div>
          ),
        };

        setChatLog((prevChatLog) => [...prevChatLog, errorMessageContent]); // Update chat log with assistant's error message
        throw new Error(errorMessage); // Re-throw the error for logging purposes
      }

      const data = await response.json();
      setData(data);

      // Function to convert object to string
      const convertToString = (input) => {
        if (typeof input === 'string') {
          return input;
        } else if (Array.isArray(input)) {
          return input.map(convertToString).join(', ');
        } else if (typeof input === 'object' && input !== null) {
          return Object.entries(input)
            .map(([key, value]) => `${key}: ${convertToString(value)}`)
            .join(', ');
        }
        return String(input);
      };

      // Handle the response data similarly to handleSubmit
      let modelReply = 'No valid reply found.'; // Default message
      if (data) {
        // Check if the response is a JSON array of objects
        if (Array.isArray(data) && data.every(item => typeof item === 'object')) {
          const columnCount = Object.keys(data[0]).length;
          const rowCount = data.length;

          // Convert to a table-like format with borders for display
          modelReply = (
            <div style={{ display: 'flex', alignItems: 'start' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th key={key} style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((val, colIndex) => (
                        <td key={colIndex} style={{ border: '1px solid black', padding: '8px' }}>{convertToString(val)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {(rowCount > 1 && columnCount > 1) && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<BarChartIcon />}
                  sx={{ display: 'flex', alignItems: 'center', padding: '8px 16px', marginLeft: '15px', width: '190px', fontSize: '10px', fontWeight: 'bold' }}
                  onClick={handleGraphClick}
                >
                  Graph View
                </Button>
              )}
            </div>
          );
        } else if (typeof data === 'string') {
          // If it's a string, display it as text and store it in the state
          modelReply = data;
          //setStoredResponse(data);
          setIsLoading(true);
        } else {
          // Otherwise, convert to string
          modelReply = convertToString(data);
        }
      }

      const botMessage = {
        role: 'assistant',
        content: modelReply,
      };

      setChatLog((prevChatLog) => [...prevChatLog, botMessage]); // Update chat log with assistant's message
    } catch (err) {
      // Handle network errors or other unexpected issues
      const fallbackErrorMessage = 'Error communicating with backend.';
      const errorMessageContent = {
        role: 'assistant',
        content: (
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <p style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>{fallbackErrorMessage}</p>
          </div>
        ),
      };

      setChatLog((prevChatLog) => [...prevChatLog, errorMessageContent]); // Update chat log with assistant's error message
      console.error('Error:', err); // Log the error for debugging
    } finally {
      setIsLoading(false);// Set loading state to false
      setShowExecuteButton(false);
      setShowButton(false);
    }
  };

  function handleShowResponse() {
    setShowResponse((prev) => {
      const newVisibility = !prev; // Toggle SQL response visibilit
      if (newVisibility) {
        const botMessage = {
          role: 'assistant',
          content: storedResponse,
        };

        setChatLog((prevChatLog) => [...prevChatLog, botMessage]);
      } else {
        setChatLog((prevChatLog) => {
          if (prevChatLog.length > 0 && prevChatLog[prevChatLog.length - 1].role === 'assistant') {
            return prevChatLog.slice(0, prevChatLog.length - 1);
          }
          return prevChatLog;
        });
      }

      return newVisibility;
    });
  }


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
        <ChatMessage chatLog={chatLog} chatbotImage={chatbotImage} userImage={userImage} storedResponse={storedResponse} showResponse={showResponse}
        />
        <div ref={endOfMessagesRef} />
        {showButton && (
          <><Typography>Please see the details below</Typography><Button variant="contained" color="primary" onClick={handleShowResponse} sx={{ mr: 2 }}>
            {showResponse ? "Hide SQL" : "Show SQL"}
          </Button></>
        )}
        {showExecuteButton && (
          <Button variant="contained" color="primary" onClick={handleButtonClick}>
            Execute SQL
          </Button>
        )}
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
          {showInitialView && (
            <Grid item xs={12} sm={6}>
              <SuggestedPrompts
                prompts={suggestedPrompts}
                sx={{
                  mb: isSmallScreen || isMediumScreen ? '32px' : '24px',
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: '600px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              />
            </Grid>
          )}
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
      <ChartModal
        visible={isModalVisible}
        onClose={handleModalClose}
        chartData={data || []}  // Ensure you pass valid JSON data
      />
      <Modal open={openPopup}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            setOpenPopup(false);
          }
        }}
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
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Session Ended</Typography>
            <Typography sx={{ mt: 2 }}>Your session has ended due to 10 minutes of inactivity.</Typography>
            {/* New Chat Button */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setOpenPopup(false);  // Close modal
                handleNewChat(); // Start new chat
              }}
              sx={{ mt: 2 }}
            >
              New Chat
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default UserChat;