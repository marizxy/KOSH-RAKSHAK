import React from 'react';

interface NationalEmblemProps {
  className?: string;
  theme?: 'dark' | 'light' | 'gold';
}

/**
 * Authentic State Emblem of India (Lion Capital of Ashoka with Satyameva Jayate)
 * Official National Emblem representation matching Ministry of Education / NIC standards.
 */
export const NationalEmblem: React.FC<NationalEmblemProps> = ({
  className = "w-10 h-14",
  theme = "dark"
}) => {
  // Theme color mapping:
  // - dark: for white/light headers (charcoal / dark bronze #1A202C)
  // - light: for dark navy/slate banners (#FFFFFF / #F8FAFC)
  // - gold: for institutional crests (#D97706 / #B45309)
  const fillColor = theme === 'light' ? '#FFFFFF' : theme === 'gold' ? '#D97706' : '#1E293B';
  const secondaryColor = theme === 'light' ? '#E2E8F0' : theme === 'gold' ? '#B45309' : '#475569';

  return (
    <svg
      viewBox="0 0 100 135"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="National Emblem of India (Satyameva Jayate)"
    >
      {/* ========================================================= */}
      {/* 1. LION CAPITAL OF ASHOKA (TOP LIONS)                     */}
      {/* ========================================================= */}
      
      {/* Central Lion Head & Face */}
      <path
        d="M50 14 C46 14 43 17 43 21 C43 24 45 27 46 29 C44 31 43 33 43 36 C43 39 45 42 47 43 C46 45 46 47 47 49 C48 51 50 52 50 52 C50 52 52 51 53 49 C54 47 54 45 53 43 C55 42 57 39 57 36 C57 33 56 31 54 29 C55 27 57 24 57 21 C57 17 54 14 50 14 Z"
        fill={fillColor}
      />
      
      {/* Central Lion Ears */}
      <path d="M42 16 C40 14 38 15 39 18 C40 20 42 20 43 18 Z" fill={fillColor} />
      <path d="M58 16 C60 14 62 15 61 18 C60 20 58 20 57 18 Z" fill={fillColor} />
      
      {/* Central Lion Facial Details (Eyes, Muzzle, Mane Locks) */}
      <circle cx="47" cy="24" r="1.2" fill={secondaryColor} />
      <circle cx="53" cy="24" r="1.2" fill={secondaryColor} />
      <path d="M49 26 L51 26 L50 28 Z" fill={secondaryColor} />
      <path d="M47 31 C48 33 52 33 53 31 C52 30 48 30 47 31 Z" fill={secondaryColor} />
      <path d="M48 33 L48 35 L52 35 L52 33 Z" fill={fillColor} />

      {/* Central Lion Mane Ruffs (Multi-layered curls) */}
      <path
        d="M40 25 C37 27 36 30 38 33 C36 35 36 39 39 42 C38 45 40 48 43 51 C45 53 48 55 50 55 C52 55 55 53 57 51 C60 48 62 45 61 42 C64 39 64 35 62 33 C64 30 63 27 60 25 C58 22 55 20 50 20 C45 20 42 22 40 25 Z"
        fill={fillColor}
        fillOpacity="0.9"
      />

      {/* Central Mane Detail Lines */}
      <path d="M43 32 C41 35 43 38 46 40" stroke={secondaryColor} strokeWidth="0.8" strokeLinecap="round" />
      <path d="M57 32 C59 35 57 38 54 40" stroke={secondaryColor} strokeWidth="0.8" strokeLinecap="round" />
      <path d="M45 42 C44 46 47 48 50 50" stroke={secondaryColor} strokeWidth="0.8" strokeLinecap="round" />
      <path d="M55 42 C56 46 53 48 50 50" stroke={secondaryColor} strokeWidth="0.8" strokeLinecap="round" />

      {/* Left Lion (Profile Facing Left) */}
      <path
        d="M36 22 C33 22 30 25 28 28 C26 31 25 35 27 38 C25 40 26 44 28 47 C30 50 33 53 37 54 C38 52 38 49 37 47 C34 45 34 42 35 39 C33 37 34 33 36 31 C35 28 36 25 38 23 C37 22 37 22 36 22 Z"
        fill={fillColor}
      />
      <circle cx="29" cy="30" r="1" fill={secondaryColor} />
      <path d="M26 34 C28 35 30 35 31 34" stroke={secondaryColor} strokeWidth="0.7" />

      {/* Right Lion (Profile Facing Right) */}
      <path
        d="M64 22 C67 22 70 25 72 28 C74 31 75 35 73 38 C75 40 74 44 72 47 C70 50 67 53 63 54 C62 52 62 49 63 47 C66 45 66 42 65 39 C67 37 66 33 64 31 C65 28 64 25 62 23 C63 22 63 22 64 22 Z"
        fill={fillColor}
      />
      <circle cx="71" cy="30" r="1" fill={secondaryColor} />
      <path d="M74 34 C72 35 70 35 69 34" stroke={secondaryColor} strokeWidth="0.7" />

      {/* Lion Forelegs & Paws */}
      <path d="M42 54 L41 68 L46 68 L45 54 Z" fill={fillColor} />
      <path d="M58 54 L59 68 L54 68 L55 54 Z" fill={fillColor} />
      <path d="M34 54 L32 68 L37 68 L38 54 Z" fill={fillColor} />
      <path d="M66 54 L68 68 L63 68 L62 54 Z" fill={fillColor} />
      
      {/* Paw claws */}
      <path d="M31 68 C31 69.5 38 69.5 38 68 Z" fill={secondaryColor} />
      <path d="M40 68 C40 69.5 47 69.5 47 68 Z" fill={secondaryColor} />
      <path d="M53 68 C53 69.5 60 69.5 60 68 Z" fill={secondaryColor} />
      <path d="M62 68 C62 69.5 69 69.5 69 68 Z" fill={secondaryColor} />

      {/* ========================================================= */}
      {/* 2. THE ABACUS & FRIEZE                                    */}
      {/* ========================================================= */}
      
      {/* Abacus Top Border */}
      <rect x="18" y="70" width="64" height="2.5" rx="0.5" fill={fillColor} />
      
      {/* Abacus Main Frieze Band */}
      <rect x="20" y="72.5" width="60" height="15" fill={fillColor} fillOpacity="0.1" stroke={fillColor} strokeWidth="0.8" />

      {/* Central Ashoka Dharma Chakra (24 Spokes) */}
      <circle cx="50" cy="80" r="6" stroke={fillColor} strokeWidth="1" fill="none" />
      <circle cx="50" cy="80" r="1.2" fill={fillColor} />
      
      {/* Radiating 24 Spokes (Symmetric cross and star) */}
      <line x1="50" y1="74" x2="50" y2="86" stroke={fillColor} strokeWidth="0.6" />
      <line x1="44" y1="80" x2="56" y2="80" stroke={fillColor} strokeWidth="0.6" />
      <line x1="45.8" y1="75.8" x2="54.2" y2="84.2" stroke={fillColor} strokeWidth="0.6" />
      <line x1="45.8" y1="84.2" x2="54.2" y2="75.8" stroke={fillColor} strokeWidth="0.6" />
      <line x1="47.7" y1="74.3" x2="52.3" y2="85.7" stroke={fillColor} strokeWidth="0.5" />
      <line x1="52.3" y1="74.3" x2="47.7" y2="85.7" stroke={fillColor} strokeWidth="0.5" />
      <line x1="44.3" y1="77.7" x2="55.7" y2="82.3" stroke={fillColor} strokeWidth="0.5" />
      <line x1="44.3" y1="82.3" x2="55.7" y2="77.7" stroke={fillColor} strokeWidth="0.5" />

      {/* Left Animal: Galloping Horse */}
      <path
        d="M26 82 C28 79 30 79 32 80 C33 78 35 77 37 78 C38 79 37 81 36 82 C38 83 37 85 35 85 C33 85 32 84 31 84 C30 85 28 86 26 85 C25 84 25 83 26 82 Z"
        fill={fillColor}
      />
      <path d="M28 85 L27 87 L29 87 Z" fill={fillColor} />
      <path d="M34 85 L35 87 L37 87 Z" fill={fillColor} />

      {/* Right Animal: Majestic Bull */}
      <path
        d="M64 82 C65 80 67 79 69 80 C70 78 72 78 74 79 C75 80 75 82 74 83 C75 84 74 86 72 86 C70 86 69 84 68 84 C67 85 65 85 64 84 C63 83 63 82 64 82 Z"
        fill={fillColor}
      />
      <path d="M66 84 L65 87 L67 87 Z" fill={fillColor} />
      <path d="M72 84 L73 87 L75 87 Z" fill={fillColor} />

      {/* Abacus Bottom Border */}
      <rect x="18" y="87.5" width="64" height="2" rx="0.5" fill={fillColor} />

      {/* ========================================================= */}
      {/* 3. BELL-SHAPED INVERTED LOTUS PEDESTAL                   */}
      {/* ========================================================= */}
      <path
        d="M26 90 C34 94 42 96 50 96 C58 96 66 94 74 90 C76 95 72 101 68 103 C62 105 56 106 50 106 C44 106 38 105 32 103 C28 101 24 95 26 90 Z"
        fill={fillColor}
        fillOpacity="0.8"
      />
      
      {/* Lotus Petal Flutings */}
      <path d="M34 91 C36 96 38 100 42 103" stroke={secondaryColor} strokeWidth="0.8" fill="none" />
      <path d="M42 92 C43 97 45 101 47 104" stroke={secondaryColor} strokeWidth="0.8" fill="none" />
      <path d="M50 92 L50 105" stroke={secondaryColor} strokeWidth="0.8" />
      <path d="M58 92 C57 97 55 101 53 104" stroke={secondaryColor} strokeWidth="0.8" fill="none" />
      <path d="M66 91 C64 96 62 100 58 103" stroke={secondaryColor} strokeWidth="0.8" fill="none" />

      {/* Base Pedestal Platform */}
      <rect x="24" y="106" width="52" height="2.5" rx="1" fill={fillColor} />

      {/* ========================================================= */}
      {/* 4. MOTTO: "SATYAMEVA JAYATE" IN ENGLISH                   */}
      {/* ========================================================= */}
      <text
        x="50"
        y="122"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fontFamily="sans-serif"
        fill={fillColor}
        letterSpacing="0.08em"
      >
        SATYAMEVA JAYATE
      </text>

      {/* Subtle underbar */}
      <line x1="28" y1="126" x2="72" y2="126" stroke={secondaryColor} strokeWidth="0.7" strokeLinecap="round" />
    </svg>
  );
};
