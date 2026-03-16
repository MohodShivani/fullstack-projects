import { useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [text, setText] = useState("");
  const [ambience, setAmbience] = useState("forest");

  const [journals, setJournals] = useState([]);
  const [insights, setInsights] = useState(null);

  const [activeTab, setActiveTab] = useState(""); // entries | insights

  const ambienceOptions = [
    "forest",
    "mountain",
    "ocean"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/journal", { text, ambience });
      setText("");
      alert("Journal saved!");
    } catch (err) {
      console.log(err);
    }
  };

  const handleEntries = async () => {
    try {
      const res = await API.get("/journal");
      setJournals(res.data.journals);
      setActiveTab("entries");
    } catch (err) {
      console.log(err);
    }
  };

  const handleInsights = async () => {
    try {
      const res = await API.get("/journal/insights");
      setInsights(res.data);
      setActiveTab("insights");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Journal System
        </h1>

        {/* Journal Input */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Write your journal..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
          />

          <select
            value={ambience}
            onChange={(e) => setAmbience(e.target.value)}
            className="w-full border p-2 rounded-lg"
          >
            {ambienceOptions.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>

          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            Save Journal
          </button>

        </form>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">

          <button
            onClick={handleEntries}
            className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
          >
            View Previous Entries
          </button>

          <button
            onClick={handleInsights}
            className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
          >
            Analyze
          </button>

        </div>

        {/* Result Container (Single Div) */}
        {activeTab && (
          <div className="mt-6 border rounded-lg p-4 bg-gray-50">

            {activeTab === "entries" && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Previous Entries</h2>

                {journals.length === 0 ? (
                  <p>No journal entries found.</p>
                ) : (
                  journals.map((j) => (
                    <div
                      key={j._id}
                      className="border p-3 rounded-lg mb-2 bg-white"
                    >
                      <p className="font-medium">{j.text}</p>

                      <p className="text-sm text-gray-500">
                        Emotion: {j.emotion}
                      </p>

                      <p className="text-sm text-gray-500">
                        Ambience: {j.ambience}
                      </p>

                      <p className="text-sm text-gray-500">
                        Keywords: {j.keywords.join(", ")}
                      </p>

                      <p className="text-sm text-gray-600">
                        Summary: {j.summary}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "insights" && insights && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Insights</h2>

                <p><b>Total Entries:</b> {insights.totalEntries}</p>
                <p><b>Top Emotion:</b> {insights.topEmotion}</p>
                <p><b>Most Used Ambience:</b> {insights.mostUsedAmbience}</p>
                <p>
                  <b>Recent Keywords:</b> {insights.recentKeywords.join(", ")}
                </p>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}