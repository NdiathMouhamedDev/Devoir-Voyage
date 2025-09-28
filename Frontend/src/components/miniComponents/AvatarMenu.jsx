import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { storageUrl } from '../../utils/url';

export default function AvatarMenu() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        if (!localStorage.getItem('token')) return;
        const res = await api.get('/user');
        setUser(res.data);
      } catch (e) {
        // ignore if not logged
      }
    };
    load();
  }, []);

  if (!user) {
    return null;
  }

  const avatarSrc = user.profile_photo ? storageUrl(user.profile_photo) : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  return (
    <button
      onClick={() => navigate('/profile')}
      title={user.name || 'Mon profil'}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem' }}
    >
      <img
        src={avatarSrc}
        alt={user.name || 'Profil'}
        style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb' }}
      />
      <span style={{ fontSize: 14, color: '#374151' }}>{user.name}</span>
    </button>
  );
}
