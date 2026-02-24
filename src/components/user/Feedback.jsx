import { useEffect, useState } from "react";

const Feedback = () => {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [success, setSuccess] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);

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
      date: new Date().toLocaleString(),
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
      <p className="muted">Share your experience with city services.</p>

      {success && <p className="success">Thank you for your feedback.</p>}

      <form onSubmit={handleSubmit} className="form">
        <div>
          <p className="muted">Rate your experience</p>
          <div className="star-rating" role="radiogroup" aria-label="Feedback rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${star <= rating ? "active" : ""}`}
                onClick={() => setRating(star)}
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

      {feedbackList.length > 0 && (
        <div className="stack-block">
          <h3>Previous Feedback</h3>
          {feedbackList.map((item) => (
            <div key={item.id} className="list-item-card">
              <p className="rating-row">
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
