import React, { useState } from 'react';
import axios from 'axios';

function UploadImage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', file); // <-- الاسم الصحيح للحقل

    try {
      await axios.post('http://localhost:4000/api/admin/add-doctor', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('✔️ Uploaded successfully!');
    } catch (err) {
      console.error(err);
      setMessage('❌ Upload failed');
    }
  };

  return (
    <div className="upload">
      <form onSubmit={handleSubmit}>
        <input type="file" name="image" onChange={handleChange} required />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UploadImage;
