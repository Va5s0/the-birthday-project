import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from './Card/index';
import TreeCard from './TreeCard';
import { css } from '@emotion/css';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useContacts } from '../hooks/useContacts';

const Contacts = () => {
  const [treeView, setTreeView] = useState(false);
  const [highlightedContactId, setHighlightedContactId] = useState<string | null>(null);
  const { data: contacts = [], isLoading: loading } = useContacts();
  const location = useLocation();

  const handleToggleChange = (
    _: React.MouseEvent<HTMLElement>,
    value: string | null
  ) => {
    if (value !== null) setTreeView(value === 'tree');
  };

  // Handle scroll-to-contact from calendar navigation
  useEffect(() => {
    const state = location.state as {
      scrollToContactId?: string;
      highlightContact?: boolean;
      connectionId?: string;
      isConnection?: boolean;
    };

    if (state?.scrollToContactId && !loading && contacts.length > 0) {
      // Wait for render, then scroll to contact
      setTimeout(() => {
        const contactElement = document.getElementById(`contact-${state.scrollToContactId}`);
        if (contactElement) {
          contactElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });

          // Add highlight effect
          if (state.highlightContact && state.scrollToContactId) {
            setHighlightedContactId(state.scrollToContactId);
            // Remove highlight after animation
            setTimeout(() => {
              setHighlightedContactId(null);
            }, 3000);
          }
        }
      }, 100);

      // Clear the navigation state after processing
      // (but keep it briefly for Card component to read)
      setTimeout(() => {
        window.history.replaceState({}, document.title);
      }, 500);
    }
  }, [location.state, loading, contacts]);

  if (loading) {
    return <div className={styles.container}>Loading contacts...</div>;
  }

  return (
    <>
      <div className={styles.toggleContainer}>
        <ToggleButtonGroup
          value={treeView ? 'tree' : 'cards'}
          exclusive
          onChange={handleToggleChange}
          aria-label="contacts view toggle"
          size="small"
          className={styles.toggleGroup}
        >
          <ToggleButton
            value="cards"
            aria-label="cards view"
            className={styles.toggleButton}
          >
            ⊞ Cards view
          </ToggleButton>
          <ToggleButton
            value="tree"
            aria-label="tree list view"
            className={styles.toggleButton}
          >
            ☰ Tree view
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      {treeView ? (
        <TreeCard contacts={contacts} />
      ) : (
        <div className={styles.container}>
          {contacts.map((contact, idx) => {
            const state = location.state as {
              scrollToContactId?: string;
              connectionId?: string;
              isConnection?: boolean;
            };

            // Check if this is the target contact and has connection info
            const shouldOpenConnections =
              state?.scrollToContactId === contact.id &&
              state?.isConnection &&
              !!state?.connectionId;

            return (
              <div
                key={contact.id || `contact-${idx}`}
                id={`contact-${contact.id}`}
                className={`${styles.cardWrapper} ${
                  highlightedContactId === contact.id ? styles.highlighted : ''
                }`}
              >
                <Card
                  cardKey={idx.toString()}
                  contact={contact}
                  autoOpenConnections={shouldOpenConnections}
                  highlightConnectionId={shouldOpenConnections ? state.connectionId : undefined}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Contacts;

const styles = {
  container: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
    padding: 32px;
    background-color: var(--bg-primary);
    margin: 0 auto;
    max-width: 1400px;
    transition: background-color 0.3s ease;

    @media (max-width: 1440px) {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      padding: 24px;
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
      padding: 16px;
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      gap: 12px;
      padding: 12px;
    }
  `,
  toggleContainer: css`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 32px;
    background-color: var(--bg-primary);
    border-bottom: 1px solid var(--border-primary);
    transition: all 0.3s ease;
  `,
  toggleGroup: css`
    background: var(--bg-surface);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: 4px;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
    gap: 4px;
  `,
  toggleButton: css`
    border: none !important;
    border-radius: 12px !important;
    padding: 8px 16px !important;
    font-weight: 500 !important;
    font-size: 0.875rem !important;
    color: var(--text-secondary) !important;
    background: transparent !important;
    transition: all 0.3s ease !important;

    &:hover {
      background: var(--bg-tertiary) !important;
      color: var(--text-primary) !important;
    }

    &.Mui-selected {
      background: var(--primary-main) !important;
      color: var(--text-inverse) !important;
      box-shadow: var(--shadow-sm) !important;

      &:hover {
        background: var(--primary-dark) !important;
        color: var(--text-inverse) !important;
      }
    }
  `,
  cardWrapper: css`
    transition: all 0.5s ease;
    border-radius: 16px;
  `,
  highlighted: css`
    animation: highlightPulse 3s ease-in-out;

    @keyframes highlightPulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: none;
      }
      10%, 30% {
        transform: scale(1.03);
        box-shadow: 0 0 0 4px var(--primary-main),
                    0 0 0 8px rgba(33, 150, 243, 0.3),
                    0 0 30px rgba(33, 150, 243, 0.5);
      }
      20% {
        transform: scale(1.02);
      }
      50% {
        transform: scale(1);
        box-shadow: 0 0 0 4px var(--primary-main),
                    0 0 0 8px rgba(33, 150, 243, 0.2);
      }
    }
  `,
};
