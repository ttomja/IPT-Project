// src/components/LoadingMessage.js
function LoadingMessage({ message = "Loading..." }) {
  return <p className="message loading-message">{message}</p>;
}
export default LoadingMessage;
