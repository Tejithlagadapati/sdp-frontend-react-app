import { useState, useEffect } from "react";

const Feedback = () => {

  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [success, setSuccess] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("feedbacks")) || [];
    setFeedbackList(stored);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const newFeedback = {
      id: Date.now(),
      message,
      rating,
      date: new Date().toLocaleString()
    };

    const updated = [newFeedback, ...feedbackList];

    localStorage.setItem("feedbacks", JSON.stringify(updated));
    setFeedbackList(updated);

    setMessage("");
    setRating(0);
    setSuccess(true);

    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="card">

      <h2>Feedback</h2>
      <p>Share your experience with city services</p>

      {success && (
        <p className="success">✅ Thank you for your feedback!</p>
      )}

      <form onSubmit={handleSubmit} className="form">

        <div>
          <p style={{ marginBottom: "6px" }}>Rate your experience</p>
          <div>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "24px",
                  color: star <= rating ? "#f59e0b" : "#d1d5db",
                  padding: "0 2px"
                }}
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <textarea
          placeholder="Write your feedback here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button type="submit">Submit</button>

      </form>

      {/* Show Previous Feedback */}

      {feedbackList.length > 0 && (

        <div style={{ marginTop: "25px" }}>

          <h3>Previous Feedback</h3>

          {feedbackList.map(item => (
            <div
              key={item.id}
              style={{
                background: "#f9fafb",
                padding: "10px",
                marginTop: "10px",
                borderRadius: "6px",
                fontSize: "14px"
              }}
            >
              <p style={{ marginBottom: "6px", fontSize: "16px" }}>
                {"★".repeat(item.rating || 0)}
                {"☆".repeat(5 - (item.rating || 0))}
              </p>
              <p>{item.message}</p>
              <small>{item.date}</small>
            </div>
          ))}

        </div>

      )}

    </div>
  );
};

export default Feedback;