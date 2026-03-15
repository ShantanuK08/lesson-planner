import { useQuery, useMutation } from '@apollo/client';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { GET_LESSON } from '../graphql/queries';
import { ADD_COMMENT } from '../graphql/mutations';

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  useSelector(state => state.auth);
  const [comment, setComment] = useState('');

  const { data, loading, refetch } = useQuery(GET_LESSON, {
    variables: { id }
  });

  const [addComment, { loading: commenting }] = useMutation(ADD_COMMENT);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await addComment({
      variables: { lesson_id: id, content: comment }
    });
    setComment('');
    refetch();
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;

  const lesson = data?.lesson;
  if (!lesson) return <p style={{ padding: '2rem' }}>Lesson not found.</p>;

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

      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '12px', background: '#e0e7ff', color: '#4f46e5', padding: '2px 8px', borderRadius: '10px' }}>{lesson.subject}</span>
            <span style={{ fontSize: '12px', color: lesson.is_published ? 'green' : '#999' }}>
              {lesson.is_published ? 'Published' : 'Draft'}
            </span>
          </div>
          <h2 style={{ margin: '0 0 8px', color: '#111' }}>{lesson.title}</h2>
          <p style={{ color: '#666', fontSize: '13px', margin: '0 0 4px' }}>Grade: {lesson.grade}</p>
          <p style={{ color: '#666', fontSize: '13px', margin: '0 0 1.5rem' }}>By: {lesson.owner?.name}</p>

          {lesson.objectives && (
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 8px', color: '#333' }}>Objectives</h4>
              <p style={{ color: '#555', lineHeight: '1.6' }}>{lesson.objectives}</p>
            </div>
          )}

          {lesson.content && (
            <div>
              <h4 style={{ margin: '0 0 8px', color: '#333' }}>Content</h4>
              <p style={{ color: '#555', lineHeight: '1.6' }}>{lesson.content}</p>
            </div>
          )}
        </div>

        <div style={{ background: 'white', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 1.5rem' }}>Comments</h3>

          <form onSubmit={handleComment} style={{ marginBottom: '1.5rem' }}>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Leave a comment..."
              rows={3}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '8px' }}
            />
            <button
              type="submit"
              disabled={commenting}
              style={{ padding: '8px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {commenting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>

          {(!lesson.comments || lesson.comments.length === 0) && (
            <p style={{ color: '#999', textAlign: 'center' }}>No comments yet. Be the first!</p>
          )}

          {lesson.comments?.map(c => (
            <div key={c.id} style={{ borderTop: '1px solid #f0f0f0', padding: '1rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: '500', fontSize: '14px' }}>{c.user?.name}</span>
                <span style={{ fontSize: '12px', color: '#999' }}>{new Date(parseInt(c.created_at)).toLocaleDateString()}</span>
              </div>
              <p style={{ margin: 0, color: '#555', fontSize: '14px' }}>{c.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}