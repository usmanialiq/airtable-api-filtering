import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginStudent, logoutStudent } from './store/actions';
import { useAppSelector } from './hooks';
import { IClass } from './interfaces';

function App() {
    const [name, setName] = useState('');
    const dispatch = useDispatch();
    const classes: IClass[] = useAppSelector(state => state.classes);
    const isLoading: boolean = useAppSelector(state => state.isLoading);

    const handleChange = (e: any) => {
      setName(e.target.value);
    };

    const renderSearchComponent = () => (
      <div className='text-center card p-5'>
        <input 
            className='form-control'
            type='text' 
            placeholder='Search student ...' 
            value={name} 
            onChange={handleChange}
        />
        <button className='btn btn-primary mt-2' onClick={() => dispatch(loginStudent(name))}>Login</button>
      </div>
    );

    const renderClassesOfStudent = () => (
      <>
        <button className='btn btn-info my-2' onClick={() => dispatch(logoutStudent())}>Logout</button>
        {classes.map((each, idx) => (
          <div className='card my-2' key={idx}>
            <div className='card-body'>
              <h4>{each.fields.Name}</h4>

              <p><small>CLASSES</small></p>
              {each.fields.Students.join(', ')}
            </div>
          </div>
        ))}
      </>
    );

    if (isLoading) {
        return (
          <div className='spinner-border' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
        );
    }

    if (classes.length) {
      return renderClassesOfStudent();
    }

    return renderSearchComponent();
}

export default App;
