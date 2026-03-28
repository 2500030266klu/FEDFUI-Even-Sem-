import { useState } from "react";
import { toast } from "react-toastify";

export default function Feedback() {
  const [rating, setRating] = useState("");
  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!rating || !message.trim()) {
      toast.error("Please select rating and write feedback");
      return;
    }

    toast.success("Thanks for your feedback!");
    setRating("");
    setCategory("General");
    setMessage("");
  };

  return (
    <div className="page-shell">
      <div className="dashboard-grid">
        <section className="panel hero-panel">
          <span className="badge">Feedback</span>
          <h2>Help us improve CareBook Pro</h2>
          <p>
            Share your experience with the appointment system. Your feedback
            helps us make this app better.
          </p>
        </section>

        <section className="panel full-panel">
          <h3>Leave Feedback</h3>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="grid-2">
              <div className="input-group">
                <label>Overall Rating</label>
                <div className="rating-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`rating-btn ${
                        Number(rating) >= star ? "rating-active" : ""
                      }`}
                      onClick={() => setRating(String(star))}
                    >
                      {star}
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="General">General</option>
                  <option value="UI">User Interface</option>
                  <option value="Performance">Performance</option>
                  <option value="Bugs">Bugs / Issues</option>
                  <option value="Feature">New Features</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Feedback</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe what you liked or what can be improved"
              />
            </div>

            <button className="btn btn-primary full-width">
              Submit Feedback
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}