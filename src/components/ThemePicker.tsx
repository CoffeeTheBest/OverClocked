import React, { useState, useEffect } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { Theme, ThemeOption } from '../types';
import styles from './ThemePicker.module.css';

const ThemePicker: React.FC = () => {
  const { theme, setTheme } = useGlobal();
  const [isOpen, setIsOpen] = useState(false);

  // Define available theme options
  const themeOptions: ThemeOption[] = [
    {
      id: 'purple-dark',
      name: 'Purple Dark',
      description: 'Elegant purple with dark background',
      primaryColor: '#8b5cf6',
      secondaryColor: '#a855f7',
      accentColor: '#fbbf24',
      isDark: true
    },
    {
      id: 'purple-light',
      name: 'Purple Light',
      description: 'Elegant purple with light background',
      primaryColor: '#7c3aed',
      secondaryColor: '#8b5cf6',
      accentColor: '#f59e0b',
      isDark: false
    },
    {
      id: 'dark',
      name: 'Classic Dark',
      description: 'Professional dark theme',
      primaryColor: '#0066cc',
      secondaryColor: '#6b46c1',
      accentColor: '#f59e0b',
      isDark: true
    },
    {
      id: 'light',
      name: 'Classic Light',
      description: 'Professional light theme',
      primaryColor: '#0066cc',
      secondaryColor: '#6b46c1',
      accentColor: '#f59e0b',
      isDark: false
    },
    {
      id: 'ocean-dark',
      name: 'Ocean Dark',
      description: 'Deep blue oceanic vibes',
      primaryColor: '#06b6d4',
      secondaryColor: '#3b82f6',
      accentColor: '#f97316',
      isDark: true
    },
    {
      id: 'ocean-light',
      name: 'Ocean Light',
      description: 'Light oceanic freshness',
      primaryColor: '#0891b2',
      secondaryColor: '#2563eb',
      accentColor: '#ea580c',
      isDark: false
    },
    {
      id: 'forest-dark',
      name: 'Forest Dark',
      description: 'Nature-inspired green theme',
      primaryColor: '#10b981',
      secondaryColor: '#059669',
      accentColor: '#f59e0b',
      isDark: true
    },
    {
      id: 'forest-light',
      name: 'Forest Light',
      description: 'Fresh natural greens',
      primaryColor: '#059669',
      secondaryColor: '#047857',
      accentColor: '#d97706',
      isDark: false
    },
    {
      id: 'sunset-dark',
      name: 'Sunset Dark',
      description: 'Warm sunset colors',
      primaryColor: '#f97316',
      secondaryColor: '#dc2626',
      accentColor: '#fbbf24',
      isDark: true
    },
    {
      id: 'sunset-light',
      name: 'Sunset Light',
      description: 'Bright sunset warmth',
      primaryColor: '#ea580c',
      secondaryColor: '#dc2626',
      accentColor: '#f59e0b',
      isDark: false
    },
    {
      id: 'cyber-dark',
      name: 'Cyber Dark',
      description: 'Neon cyberpunk aesthetic',
      primaryColor: '#00f5ff',
      secondaryColor: '#ff00ff',
      accentColor: '#ffff00',
      isDark: true
    },
    {
      id: 'cyber-light',
      name: 'Cyber Light',
      description: 'Bright cyber futuristic',
      primaryColor: '#0080ff',
      secondaryColor: '#8000ff',
      accentColor: '#ff8000',
      isDark: false
    }
  ];

  const currentThemeOption = themeOptions.find(option => option.id === theme);

  const handleThemeSelect = (themeId: Theme) => {
    setTheme(themeId);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(`.${styles.themePicker}`)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={styles.themePicker}>
      <button
        className={styles.themeButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open theme picker"
        title={`Current theme: ${currentThemeOption?.name}`}
      >
        <div className={styles.iconContainer}>
          <svg
            className={styles.icon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
            />
          </svg>
        </div>
        <div className={styles.colorPreview}>
          <div
            className={styles.colorDot}
            style={{ backgroundColor: currentThemeOption?.primaryColor }}
          />
          <div
            className={styles.colorDot}
            style={{ backgroundColor: currentThemeOption?.secondaryColor }}
          />
          <div
            className={styles.colorDot}
            style={{ backgroundColor: currentThemeOption?.accentColor }}
          />
        </div>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <h3>Choose Theme</h3>
            <p>Pick your favorite color scheme</p>
          </div>
          
          <div className={styles.themeGrid}>
            {themeOptions.map((option) => (
              <button
                key={option.id}
                className={`${styles.themeOption} ${
                  theme === option.id ? styles.active : ''
                }`}
                onClick={() => handleThemeSelect(option.id)}
                title={option.description}
              >
                <div className={styles.themePreview}>
                  <div className={styles.previewColors}>
                    <div
                      className={styles.previewColor}
                      style={{ backgroundColor: option.primaryColor }}
                    />
                    <div
                      className={styles.previewColor}
                      style={{ backgroundColor: option.secondaryColor }}
                    />
                    <div
                      className={styles.previewColor}
                      style={{ backgroundColor: option.accentColor }}
                    />
                  </div>
                  <div className={styles.themeBadge}>
                    {option.isDark ? (
                      <svg className={styles.badgeIcon} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    ) : (
                      <svg className={styles.badgeIcon} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                
                <div className={styles.themeInfo}>
                  <div className={styles.themeName}>{option.name}</div>
                  <div className={styles.themeDescription}>{option.description}</div>
                </div>

                {theme === option.id && (
                  <div className={styles.activeIndicator}>
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className={styles.dropdownFooter}>
            <p>Themes automatically save your preference</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemePicker;
