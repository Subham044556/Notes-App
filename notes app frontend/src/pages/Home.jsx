import { useEffect, useState } from "react";
import API from "../services/api";
import { Plus } from "lucide-react";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);
  const colors = [
    "#92DCE5",
    "#FFBFA0",
    "#D34F73",
    "#B2EF9B",
    "#DDD6FE",
    "#ECFFB0",
    "#FFD9DA",
    "#838E83",
  ];

  // FETCH NOTES 
  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // CREATE NOTE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      formData.append("title", title);
      formData.append("content", content);
      formData.append("color", randomColor);

      if (image) {
        formData.append("image", image);
      }

      await API.post("/notes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setTitle("");
      setContent("");
      setImage(null);

      fetchNotes();
    } catch (err) {
      console.log(err.response?.data);
      console.log(err.message);
    }
  };

  // DELETE NOTE
  const deleteNote = async (id) => {
    try {
      await API.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await API.get("/notes");
        setNotes(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-[#e9ece6] flex flex-col items-center py-10 px-4">
      {/* TITLE */}
      <h1 className="text-4xl font-serif font-bold text-gray-800 mb-8">
        📝 Notes
      </h1>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-6 left-6 bg-[#28396C] hover:bg-[#1d2d59] text-white p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 z-50"
      >
        <Plus size={28} />
      </button>
      {/* FORM CARD */}
    {open && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative bg-[#EAE6BC] shadow-xl rounded-2xl p-6 w-full max-w-md">
        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-4 text-2xl font-bold text-gray-700 hover:text-red-500"
        >
          ×
        </button>

        <h2 className="text-xl font-mono font-semibold mb-4">
          Create a Note
        </h2>

        <form
          onSubmit={(e) => {
            handleSubmit(e);
            setOpen(false);
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="border p-2 rounded-lg"
          />

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono"
          />

          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border p-2 font-mono rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="bg-[#28396C] text-white py-2 rounded-lg hover:bg-[#053327] transition"
          >
            Add Note
          </button>
        </form>
      </div>
    </div>
    )}
      {/* NOTES SECTION */}
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Your Notes
        </h2>

        {notes.length === 0 ? (
          <p className="text-gray-500">No notes yet</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {notes.map((note) => (
              <div
                key={note._id}
                style={{ backgroundColor: note.color }}
                className="p-5 rounded-2xl shadow-md hover:shadow-lg transition"
              >
                {/* Title + Date/Time */}
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-gray-800">
                    {note.title}
                  </h3>
                </div>

                {note.image && (
                  <img
                    src={`http://localhost:5000/${note.image}`}
                    alt=""
                    className="mt-3 rounded-lg w-full h-40 object-cover"
                  />
                )}

                <p className="text-black font-noteworthy mt-2">
                  {note.content}
                </p>

                <div className="flex justify-between items-end mt-4">
                  <button
                    onClick={() => deleteNote(note._id)}
                    className="bg-[#C44A3A] text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>

                  <p className="text-[11px] text-gray-700 text-right leading-4">
                    {new Date(note.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    <br />
                    {new Date(note.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
