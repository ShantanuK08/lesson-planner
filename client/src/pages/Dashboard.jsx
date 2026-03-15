import { useQuery, useMutation } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GET_MY_LESSONS, GET_LESSONS } from '../graphql/queries';
import { DELETE_LESSON } from '../graphql/mutations';
import { logout } from '../store/authSlice';
import { setLessons, deleteLesson } from '../store/lessonSlice';
import { useEffect } from 'react';

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { lessons } = useSelector(state => state.lessons);

  const isStudent = user?.role === 'student';
  const isAdmin = user?.role === 'admin';

  const { data: myData, loading: myLoading } = useQuery(GET_MY_LESSONS, {
    skip: isStudent,
  });

  const { data: allData, loading: allLoading } = useQuery(GET_LESSONS, {
    skip: !isStudent,
  });

  useEffect(() => {
    if (isStudent && allData?.lessons) {
      dispatch(setLessons(allData.lessons));
    } else if (!isStudent && myData?.myLessons) {
      dispatch(setLessons(myData.myLessons));
    }
  }, [myData, allData, isStudent, dispatch]);

  const [deleteLessonMutation] = useMutation(DELETE_LESSON);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lesson?')) return;
    await deleteLessonMutation({ variables: { id } });
    dispatch(deleteLesson(id));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const loading = myLoading || allLoading;
  const roleColor = isAdmin ? '#dc2626' : isStudent ? '#059669' : '#4f46e5';
  const roleLabel = isAdmin ? 'Admin' : isStudent ? 'Student' : 'Teacher';

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{ background: roleColor, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '1.2rem' }}>Lesson Planner</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ color: 'white', fontSize: '13px', background: 'rgba(255,255,255,0.2)', padding: '2px 10px', borderRadius: '10px' }}>{roleLabel}</span>
          <span style={{ color: 'white' }}>Hi, {user?.name || 'User'}</span>
          <button
            onClick={handleLogout}
            style={{ padding: '6px 14px', background: 'white', color: roleColor, border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ margin: 0 }}>
              {isStudent ? 'Published Lessons' : isAdmin ? 'All Lessons' : 'My Lessons'}
            </h2>
            <p style={{ margin: '4px 0 0', color: '#666', fontSize: '13px' }}>
              {isStudent ? 'Browse available lessons' : isAdmin ? 'Manage all lessons across all teachers' : 'Create and manage your lessons'}
            </p>
          </div>
          {!isStudent && (
            <button
              onClick={() => navigate('/lessons/new')}
              style={{ padding: '10px 20px', background: roleColor, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              + New Lesson
            </button>
          )}
        </div>

        {loading && <p>Loading lessons...</p>}

        {!loading && lessons.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '8px' }}>
            <p style={{ color: '#666' }}>
              {isStudent ? 'No published lessons yet.' : 'No lessons yet. Create your first one!'}
            </p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {lessons.map(lesson => (
            <div key={lesson.id} style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', background: '#e0e7ff', color: '#4f46e5', padding: '2px 8px', borderRadius: '10px' }}>{lesson.subject}</span>
                <span style={{ fontSize: '12px', color: lesson.is_published ? 'green' : '#999' }}>
                  {lesson.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: '1rem' }}>{lesson.title}</h3>
              <p style={{ color: '#666', fontSize: '13px', margin: '0 0 4px' }}>Grade: {lesson.grade}</p>
              {isAdmin && (
                <p style={{ color: '#999', fontSize: '12px', margin: '0 0 1rem' }}>
                  By: {lesson.owner?.name || 'Unknown'}
                </p>
              )}
              {!isAdmin && <div style={{ marginBottom: '1rem' }} />}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => navigate(`/lessons/${lesson.id}/view`)}
                  style={{ flex: 1, padding: '6px', background: 'white', color: roleColor, border: `1px solid ${roleColor}`, borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                >
                  View
                </button>
                {!isStudent && !isAdmin && (
                  <button
                    onClick={() => navigate(`/lessons/${lesson.id}`)}
                    style={{ flex: 1, padding: '6px', background: roleColor, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    Edit
                  </button>
                )}
                {!isStudent && (
                  <button
                    onClick={() => handleDelete(lesson.id)}
                    style={{ flex: 1, padding: '6px', background: 'white', color: 'red', border: '1px solid red', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}