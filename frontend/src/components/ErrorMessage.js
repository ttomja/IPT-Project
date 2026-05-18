// src/components/ErrorMessage.js
function ErrorMessage({ message }) {
  if (!message) return null;
  return <p className="message error-message">{message}</p>;
}
export default ErrorMessage;
