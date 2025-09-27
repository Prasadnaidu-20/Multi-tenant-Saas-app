import { useEffect, useState } from 'react';

const NotesPage = () => {
  type Note = {
  _id: string;
  title: string;
  content: string;
};

const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem('token'); // token stored after login
      if (!token) return;

      const res = await fetch('http://localhost:5000/api/notes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      console.log(data);
      setNotes(data); // update state to display notes
    };

    fetchNotes();
  }, []);

  return (
    <div>
      <h1>Your Notes</h1>
      {notes.length === 0 ? (
  <p>No notes yet. Create your first note!</p>
) : (
  notes.map((note) => (
    <div key={note._id}>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
    </div>
  ))
)}
    </div>
  );
};

export default NotesPage;
