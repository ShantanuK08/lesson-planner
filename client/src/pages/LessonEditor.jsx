import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_LESSON } from '../graphql/queries';
import { CREATE_LESSON, UPDATE_LESSON } from '../graphql/mutations';
import { addLesson, updateLesson } from '../store/lessonSlice';

export default function LessonEditor() {
  const { id } = useParams();
  const isEditing = !!id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    subject: '',
    grade: '',
    objectives: '',
    content: '',
    is_published: false,
  });

  const [error, setError] = useState('');

  useQuery(GET_LESSON, {
    variables: { id },
    skip: !isEditing,
    onCompleted: (data) => {
      if (data?.lesson) {
        setForm({
          title: data.lesson.title,
          subject: data.lesson.subject,
          grade: data.lesson.grade,
          objectives: data.lesson.objectives || '',
          content: data.lesson.content || '',
          is_published: data.lesson.is_published,
        });
      }
    }
  });

  const [createLesson, { loading: creating }] = useMutation(CREATE_LESSON);
  const [updateLessonMutation, { loading: updating }] = useMutation(UPDATE_LESSON);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isEditing) {
        const { data } = await updateLessonMutation({
          variables: { id, ...form }
        });
        dispatch(updateLesson(data.updateLesson));
      } else {
        const { data } = await createLesson({
          variables: form
        });
        dispatch(addLesson(data.createLesson));
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{ background: '#4f46e5', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '1.2rem' }}>Lesson Planner</h1>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ padding: '6px 14px', background: 'white', color: '#4f46e5', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Back to Dashboard
        </button>
      </nav>

      <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
        <h2>{isEditing ? 'Edit Lesson' : 'Create New Lesson'}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ddd' }}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label>Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ddd' }}
                required
              />
            </div>
            <div>
              <label>Grade</label>
              <input
                type="text"
                value={form.grade}
                onChange={e => setForm({ ...form, grade: e.target.value })}
                style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ddd' }}
                required
              />
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Objectives</label>
            <textarea
              value={form.objectives}
              onChange={e => setForm({ ...form, objectives: e.target.value })}
              rows={3}
              style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Content</label>
            <textarea
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              rows={6}
              style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="published"
              checked={form.is_published}
              onChange={e => setForm({ ...form, is_published: e.target.checked })}
            />
            <label htmlFor="published">Publish this lesson</label>
          </div>
          <button
            type="submit"
            disabled={creating || updating}
            style={{ width: '100%', padding: '10px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
          >
            {creating || updating ? 'Saving...' : isEditing ? 'Update Lesson' : 'Create Lesson'}
          </button>
        </form>
      </div>
    </div>
  );
}