import React from 'react';
import { Shield, Zap, Crown, Heart, Star, Award } from 'lucide-react';

interface BadgeIconProps {
  icon: string;
  className?: string;
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({ icon, className = "h-4 w-4" }) => {
  const iconComponents = {
    'shield-check': Shield,
    'zap': Zap,
    'crown': Crown,
    'heart': Heart,
    'star': Star,
    'award': Award
  };

  const IconComponent = iconComponents[icon as keyof typeof iconComponents] || Star;

  return <IconComponent className={className} />;
};