import { useEffect, useMemo, useState } from 'react';
import { createEntry, deleteEntry, getEntries, updateEntry } from './api/journalApi';
import Icon from './components/Icon';
import { formatEntryDate } from './utils/date';

// --- empty form template ---
const emptyForm = {
  title: '',
  content: ''
};

// map moods to tone classes
const moodTone = {
  happy: 'positive',
  calm: 'positive',
  excited: 'positive',
  grateful: 'positive',
  sad: 'sad',
  stressed: 'warning',
  anxious: 'warning',
  frustrated: 'warning',
  angry: 'warning',
  unknown: 'neutral',
  neutral: 'neutral'
};

function getMoodClass(mood) {
  return moodTone[mood?.toLowerCase()] ?? 'neutral';
}

function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // --- fetch entries on mount ---
  useEffect(() => {
    loadEntries();
  }, []);

  // --- api helpers ---
  async function loadEntries() {
    try {
      setIsLoading(true);
      setError('');
      const data = await getEntries();
      setEntries(sortEntries(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function sortEntries(items) {
    return [...items].sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0));
  }

  // --- form stuff ---
  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      setError('Please add both a title and an entry before saving.');
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      const savedEntry = editingId
        ? await updateEntry(editingId, form)
        : await createEntry(form);

      setEntries((current) => {
        const withoutOldEntry = current.filter((entry) => entry.id !== savedEntry.id);
        return sortEntries([savedEntry, ...withoutOldEntry]);
      });

      setForm(emptyForm);
      setEditingId(null);
      setSuccess(editingId ? 'Entry updated and mood rechecked.' : 'Entry saved. Groq AI detected the mood.');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  function startEditing(entry) {
    setForm({
      title: entry.title ?? '',
      content: entry.content ?? ''
    });
    setEditingId(entry.id);
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function clearForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
    setSuccess('');
  }

  async function removeEntry(id) {
    try {
      setError('');
      setSuccess('');
      await deleteEntry(id);
      setEntries((current) => current.filter((entry) => entry.id !== id));
      if (editingId === id) {
        clearForm();
      }
      setSuccess('Entry deleted.');
    } catch (err) {
      setError(err.message);
    }
  }

  // --- search filter ---
  const filteredEntries = useMemo(() => {
    const term = searchText.trim().toLowerCase();
    if (!term) {
      return entries;
    }

    return entries.filter((entry) => {
      const title = entry.title?.toLowerCase() ?? '';
      const content = entry.content?.toLowerCase() ?? '';
      const mood = entry.mood?.toLowerCase() ?? '';
      return title.includes(term) || content.includes(term) || mood.includes(term);
    });
  }, [entries, searchText]);

  const latestMood = entries[0]?.mood ?? 'Waiting';

  // --- html page structure ---
  return (
    <div className="app">
      {/* top navigation */}
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-icon">
            <Icon name="book" size={23} />
          </span>
          <span>Smart Journal</span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#write">Write</a>
          <a href="#entries">Entries</a>
          <a href="#moods">Mood</a>
        </nav>
      </header>

      <main className="page">
        {/* hero / summary */}
        <section className="intro">
          <div>
            <h1 style={{ color: 'var(--accent-dark)' }}>Write your day. Let AI tell the mood.</h1>
            <p>
              Save a journal entry and your Spring Boot backend asks Groq AI to detect the
              mood automatically.
            </p>
          </div>
          <div className="summary-strip" id="moods">
            <div>
              <span>{entries.length}</span>
              <small>Total entries</small>
            </div>
            <div>
              <span>{latestMood}</span>
              <small>Latest mood</small>
            </div>
          </div>
        </section>

        <section className="workspace">
          {/* form for entry */}
          <form className="editor-panel" id="write" onSubmit={handleSubmit}>
            <div className="section-heading">
              <div>
                <h2>{editingId ? 'Edit Journal Entry' : 'New Journal Entry'}</h2>
                <p>Title and content are sent to the backend. Mood is filled by Groq AI.</p>
              </div>
              {editingId && (
                <button className="icon-button" type="button" onClick={clearForm} title="Cancel edit">
                  <Icon name="x" size={18} />
                </button>
              )}
            </div>

            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Productive day at college"
              maxLength="90"
            />

            <label htmlFor="content">Entry</label>
            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Write your thoughts here..."
              maxLength="5000"
            />

            <div className="ai-note">
              <Icon name="sparkles" size={18} />
              <span>After saving, Groq AI analyzes the text and returns the mood.</span>
            </div>

            {error && <p className="message error">{error}</p>}
            {success && <p className="message success">{success}</p>}

            <div className="form-actions">
              <button className="primary-button" type="submit" disabled={isSaving}>
                {isSaving ? <Icon className="spin" name="loader" size={18} /> : <Icon name="save" size={18} />}
                {isSaving ? 'Saving...' : editingId ? 'Update Entry' : 'Save Entry'}
              </button>
              <button className="secondary-button" type="button" onClick={clearForm}>
                <Icon name="refresh" size={17} />
                Clear
              </button>
            </div>
          </form>

          {/* saved entries list */}
          <section className="entries-panel" id="entries" aria-labelledby="entries-title">
            <div className="section-heading">
              <div>
                <h2 id="entries-title">Saved Entries</h2>
                <p>Your recent journal entries with AI-detected mood.</p>
              </div>
              <button className="icon-button" type="button" onClick={loadEntries} title="Refresh entries">
                <Icon name="refresh" size={18} />
              </button>
            </div>

            <div className="search-box">
              <Icon name="search" size={17} />
              <input
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search title, content, or mood"
              />
            </div>

            {isLoading ? (
              <div className="empty-state">
                <Icon className="spin" name="loader" size={24} />
                <span>Loading entries...</span>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="empty-state">
                <Icon name="check" size={24} />
                <span>No entries found. Write the first one.</span>
              </div>
            ) : (
              <div className="entry-list">
                {filteredEntries.map((entry) => (
                  <article className="entry-row" key={entry.id}>
                    <div className="entry-main">
                      <h3>{entry.title}</h3>
                      <p>{entry.content}</p>
                    </div>

                    <div className="entry-meta">
                      <span className={`mood ${getMoodClass(entry.mood)}`}>
                        {entry.mood || 'Unknown'}
                      </span>
                      <span className="date">
                        <Icon name="calendar" size={15} />
                        {formatEntryDate(entry.createdAt)}
                      </span>
                      <div className="row-actions">
                        <button type="button" onClick={() => startEditing(entry)} title="Edit entry">
                          <Icon name="edit" size={16} />
                        </button>
                        <button type="button" onClick={() => removeEntry(entry.id)} title="Delete entry">
                          <Icon name="trash" size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;
