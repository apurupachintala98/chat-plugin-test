import React, { useState } from 'react';

const ThumbsUpIcon = () => (
  <svg
    className="w-[16px] h-[16px] text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M7 11c.889-.086 1.416-.543 2.156-1.057a22.323 
      22.323 0 0 0 3.958-5.084 1.6 1.6 0 0 1 .582-.628 
      1.549 1.549 0 0 1 1.466-.087c.205.095.388.233.537.406a1.64
       1.64 0 0 1 .384 1.279l-1.388 4.114M7 11H4v6.5A1.5 1.5 0 0 0 5.5 
       19v0A1.5 1.5 0 0 0 7 17.5V11Zm6.5-1h4.915c.286 0 .372.014.626.15.254.135.472.332.637.572a1.874
        1.874 0 0 1 .215 1.673l-2.098 6.4C17.538 19.52 17.368 20 16.12 20c-2.303 0-4.79-.943-6.67-1.475"
    />
  </svg>
);

const ThumbsDownIcon = () => (
  <svg
    className="w-[16px] h-[16px] text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 13c-.889.086-1.416.543-2.156 1.057a22.322 22.322 0 0
       0-3.958 5.084 1.6 1.6 0 0 1-.582.628 1.549 1.549 0 0 1-1.466.087 
       1.587 1.587 0 0 1-.537-.406 1.666 1.666 0 0 1-.384-1.279l1.389-4.114M17 
       13h3V6.5A1.5 1.5 0 0 0 18.5 5v0A1.5 1.5 0 0 0 17 6.5V13Zm-6.5 1H5.585c-.286 
       0-.372-.014-.626-.15a1.797 1.797 0 0 1-.637-.572 1.873 1.873 0 0 1-.215-1.673l2.098-6.4C6.462 
       4.48 6.632 4 7.88 4c2.302 0 4.79.943 6.67 1.475"
    />
  </svg>
);

const ThumbsUpIconDark = () => (
  <svg
    className="w-6 h-6 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      fillRule="evenodd"
      d="M15.03 9.684h3.965c.322 0 .64.08.925.232.286.153.532.374.717.645a2.109
       2.109 0 0 1 .242 1.883l-2.36 7.201c-.288.814-.48 1.355-1.884 1.355-2.072
       0-4.276-.677-6.157-1.256-.472-.145-.924-.284-1.348-.404h-.115V9.478a25.485
        25.485 0 0 0 4.238-5.514 1.8 1.8 0 0 1 .901-.83 1.74 1.74 0 0 1 
        1.21-.048c.396.13.736.397.96.757.225.36.32.788.269 1.211l-1.562 
        4.63ZM4.177 10H7v8a2 2 0 1 1-4 0v-6.823C3 10.527 3.527 10 4.176 10Z"
      clipRule="evenodd"
    />
  </svg>
);

const ThumbsDownIconDark = () => (
  <svg
    className="w-6 h-6 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      fillRule="evenodd"
      d="M8.97 14.316H5.004c-.322 0-.64-.08-.925-.232a2.022 2.022 0 0 
      1-.717-.645 2.108 2.108 0 0 1-.242-1.883l2.36-7.201C5.769 3.54 5.96 
      3 7.365 3c2.072 0 4.276.678 6.156 1.256.473.145.925.284 1.35.404h.114v9.862a25.485 
      25.485 0 0 0-4.238 5.514c-.197.376-.516.67-.901.83a1.74 1.74 0 0 1-1.21.048 1.79 
      1.79 0 0 1-.96-.757 1.867 1.867 0 0 1-.269-1.211l1.562-4.63ZM19.822 14H17V6a2 2 0 
      1 1 4 0v6.823c0 .65-.527 1.177-1.177 1.177Z"
      clipRule="evenodd"
    />
  </svg>
);

const CommentIcon = () => (
  <svg
    className="w-6 h-6 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M16 10.5h.01m-4.01 0h.01M8 10.5h.01M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 
      1-1 1h-6.6a1 1 0 0 0-.69.275l-2.866 2.723A.5.5 0 0 1 8 18.635V17a1 1 0 
      0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
    />
  </svg>
);

const Feedback = ({resId , routeCd , requestId, appCd}) => {

  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);
  const [comment, setComment] = useState('');

  const handleFeedback = async (type) => {
    const newIsLiked = type === 'like' ? !isLiked : isLiked;
    const newIsDisliked = type === 'dislike' ? !isDisliked : isDisliked;

    // Toggle the appropriate state
    if (type === 'like') {
      setIsLiked(!isLiked);
      if (isDisliked) setIsDisliked(false);
    } else if (type === 'dislike') {
      setIsDisliked(!isDisliked);
      if (isLiked) setIsLiked(false);
    }

    // Prepare payload based on feedback type
    const payload = {
      resId,
      liked: type === 'like' ? !isLiked : null,
      disliked: type === 'dislike' ? !isDisliked : null,
      comment: comment.trim() !== '' ? comment : null,
    };

    try {
      const response = await fetch(`http://10.126.192.122:8000/get_llm_feedback/?app_cd=${appCd}&request_id=${requestId}&route_cd=${routeCd}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to update feedback status');
      }

      // If feedback was sent successfully and there’s a comment, clear the comment box
      if (comment.trim() !== '') {
        setComment('');
        setIsCommentBoxVisible(false);
      }

    } catch (error) {
      console.error('Error updating feedback status:', error);
      // Optionally, revert state changes if the API call fails
      if (type === 'like') {
        setIsLiked(isLiked);
      } else if (type === 'dislike') {
        setIsDisliked(isDisliked);
      }
    }
  };

  const handleButtonClick = () => {
    setIsCommentBoxVisible(!isCommentBoxVisible);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim() === '') return;

    // If the comment box is submitted
    await handleFeedback('comment'); // This just treats submitting a comment as action after checking its validity
  };

  return (
    <div className="feedback-container">
      <div className="flex items-center space-x-4">
        <p className="feedback-text font-bold m-0">Was this response helpful?</p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleFeedback('like')}
            className="text-gray-500 hover:text-gray-800"
          >
            {isLiked ? <ThumbsUpIcon /> : <ThumbsUpIcon />}
          </button>
          <button
            onClick={() => handleFeedback('dislike')}
            className="text-gray-500 hover:text-gray-800"
          >
            {isDisliked ? <ThumbsDownIcon /> : <ThumbsDownIcon />}
          </button>
          <button
            onClick={handleButtonClick}
            className="text-gray-500 hover:text-gray-800"
          >
            <CommentIcon />
          </button>
        </div>
      </div>

      {isCommentBoxVisible && (
        <div className="comment-box mt-4">
          <form onSubmit={handleCommentSubmit} className="w-60">
            <div className="flex items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
              <textarea
                id="comment"
                rows="3"
                className="block p-2 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 
                           focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 
                           dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Your message..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <button
                type="submit"
                className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer 
                           hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="#44b8f3"
                  viewBox="0 0 448 448"
                >
                  <path d="M.213 32L0 181.333 320 224 0 266.667.213 416 448 224z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Feedback;