import React from 'react';
import { USER_AVATARS, DEFAULT_AVATAR_ID, AvatarProfile } from './avatarData';

interface UserAvatarProps {
  avatarId?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
  altName?: string;
  onClick?: () => void;
}

const SIZE_MAP = {
  xs: { box: 'w-6 h-6 text-xs', emoji: 'text-xs' },
  sm: { box: 'w-8 h-8 text-sm', emoji: 'text-sm' },
  md: { box: 'w-10 h-10 text-base', emoji: 'text-lg' },
  lg: { box: 'w-14 h-14 text-xl', emoji: 'text-2xl' },
  xl: { box: 'w-20 h-20 text-3xl', emoji: 'text-4xl' },
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  avatarId,
  size = 'md',
  className = '',
  showBorder = true,
  altName = 'User',
  onClick,
}) => {
  const isCustomPhoto = avatarId && avatarId.startsWith('data:image/');
  const currentAvatar: AvatarProfile | undefined = USER_AVATARS.find(
    (a) => a.id === (avatarId || DEFAULT_AVATAR_ID)
  ) || USER_AVATARS[0];

  const sizeStyle = SIZE_MAP[size] || SIZE_MAP.md;

  if (isCustomPhoto) {
    return (
      <div
        onClick={onClick}
        className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 select-none shadow-xs ${sizeStyle.box} ${
          showBorder ? 'ring-2 ring-teal-500/40' : ''
        } ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''} ${className}`}
      >
        <img
          src={avatarId}
          alt={altName}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full shrink-0 select-none shadow-xs bg-gradient-to-tr ${
        currentAvatar.bgGradient
      } ${sizeStyle.box} ${
        showBorder ? `ring-2 ring-white/80 border border-slate-200/50` : ''
      } ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''} ${className}`}
      title={`${altName} (${currentAvatar.label})`}
    >
      <span className={`${sizeStyle.emoji} drop-shadow-sm leading-none`}>
        {currentAvatar.emoji}
      </span>
    </div>
  );
};
