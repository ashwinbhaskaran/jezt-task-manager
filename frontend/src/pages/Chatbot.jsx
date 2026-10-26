import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Chatbot() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendQuestion = async (event) => {
    event.preventDefault();

    const text = question.trim();

    if (!text || loading) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", content: text },
    ]);

    setQuestion("");
    setLoading(true);
    setError("");

    try {
      const response = await api.post("chatbot/", {
        question: text,
      });

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: response.data.answer,
        },
      ]);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to get an answer. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1>Law & Policy AI Assistant</h1>
        <p>
          Ask general questions about laws and policies.
          Specify your country or jurisdiction for more relevant information.
        </p>

        <div className="dashboard-card">
          <div
            style={{
              minHeight: "250px",
              maxHeight: "450px",
              overflowY: "auto",
              marginBottom: "20px",
            }}
          >
            {messages.length === 0 && (
              <p>
                Hello! Ask me a law or policy question to get started.
              </p>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "16px",
                  padding: "12px",
                  borderRadius: "8px",
                  background:
                    message.role === "user" ? "#dbeafe" : "#f3f4f6",
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                }}
              >
                <strong>
                  {message.role === "user" ? "You" : "AI Assistant"}
                </strong>
                <p style={{ marginBottom: 0 }}>{message.content}</p>
              </div>
            ))}

            {loading && <p>AI is preparing an answer...</p>}
          </div>

          <form onSubmit={sendQuestion}>
            <label htmlFor="law-question">Your question</label>

            <textarea
              id="law-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Example: What is a consumer's right to a refund in India?"
              rows={3}
              maxLength={2000}
              required
            />

            <button type="submit" disabled={loading || !question.trim()}>
              {loading ? "Sending..." : "Send Question"}
            </button>
          </form>

          {error && (
            <p style={{ color: "red", marginTop: "12px" }}>{error}</p>
          )}

          <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "20px" }}>
            AI answers are for general information, not legal advice.
            Verify important information with official sources or a qualified
            legal professional.
          </p>
        </div>
      </div>
    </>
  );
}

export default Chatbot;