// pages/profile.js
import Header from '../components/Header';
import ProfileForm from '../components/ProfileForm';
import { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwt.verify(token, 'your_secret_key');
      setUserData(decoded);
    }
  }, []);

  return (
    <div>
      <Header />
      {userData && <ProfileForm userData={userData} />}
    </div>
  );
};

export default ProfilePage;
