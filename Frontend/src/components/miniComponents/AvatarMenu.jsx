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

  // Fonction pour obtenir les initiales (2 lettres)
  const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  // Fonction pour générer une couleur basée sur le nom (utilisant les couleurs DaisyUI)
  const getColorFromName = (name) => {
    if (!name) return 'oklch(72% 0.219 149.579)'; // primary
    const colors = [
      'oklch(72% 0.219 149.579)', // primary
      'oklch(38% 0.063 188.416)', // secondary
      'oklch(60% 0.25 292.717)',  // accent
      'oklch(68% 0.169 237.323)', // info
      'oklch(70% 0.213 47.604)',  // warning
      'oklch(65% 0.241 354.308)', // error
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (!user) {
    return null;
  }

  const hasPhoto = user.profile_photo;
  const avatarSrc = hasPhoto ? storageUrl(user.profile_photo) : null;
  const initials = getInitials(user.name);
  const bgColor = getColorFromName(user.name);

  return (
    <button
      onClick={() => navigate('/profile')}
      title={user.name || 'Mon profil'}
      className="inline-flex items-center gap-3 px-3 py-2 rounded-2xl border-0 bg-transparent cursor-pointer transition-all duration-200 hover:bg-base-200"
    >
      <div className="relative">
        {hasPhoto ? (
          <img
            src={avatarSrc}
            alt={user.name || 'Profil'}
            className="w-14 h-14 rounded-full object-cover border-2 border-base-300 transition-colors duration-200 hover:border-primary"
          />
        ) : (
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-base-300 transition-all duration-200 hover:border-primary hover:scale-105"
            style={{ backgroundColor: bgColor }}
          >
            {initials}
          </div>
        )}
        {/* Indicateur en ligne */}
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success rounded-full border-2 border-base-100" />
      </div>
      <span className="text-sm font-medium text-base-content transition-colors duration-200 hover:text-primary">
        {user.name}
      </span>
    </button>
  );
}