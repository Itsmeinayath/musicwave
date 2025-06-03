import React from 'react';
import { Link } from 'react-router-dom';

interface Card {
  id: string;
  name: string;
  images: { url: string }[];
  type: 'album' | 'playlist' | 'artist';
  owner?: { display_name: string };
  artists?: { name: string }[];
}

interface CardGridProps {
  title: string;
  items: Card[];
}

const CardGrid: React.FC<CardGridProps> = ({ title, items }) => {
  const getSubtitle = (item: Card) => {
    if (item.type === 'album' && item.artists) {
      return item.artists.map(a => a.name).join(', ');
    } else if (item.type === 'playlist' && item.owner) {
      return `By ${item.owner.display_name}`;
    } else if (item.type === 'artist') {
      return 'Artist';
    }
    return '';
  };

  const getLink = (item: Card) => {
    switch (item.type) {
      case 'album': return `/album/${item.id}`;
      case 'playlist': return `/playlist/${item.id}`;
      case 'artist': return `/artist/${item.id}`;
      default: return '/';
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {items.length > 5 && (
          <Link to="/" className="text-text-subdued text-sm font-bold hover:underline">
            See all
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {items.slice(0, 10).map((item) => (
          <Link 
            key={item.id} 
            to={getLink(item)}
            className="card p-4 rounded-md bg-background-elevated hover:bg-background-highlight transition-colors"
          >
            <div className={`mb-4 ${item.type === 'artist' ? 'rounded-full overflow-hidden' : ''}`}>
              <img 
                src={item.images[0]?.url || 'https://via.placeholder.com/150'} 
                alt={item.name}
                className={`w-full aspect-square object-cover ${item.type === 'artist' ? 'rounded-full' : 'rounded-md'}`}
              />
            </div>
            <h3 className="font-bold truncate">{item.name}</h3>
            <p className="text-sm text-text-subdued mt-1 truncate">
              {getSubtitle(item)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CardGrid;