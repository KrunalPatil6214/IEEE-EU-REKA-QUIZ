import { Routes, Route, } from 'react-router-dom';
import EurekaLabQuiz from './components/EurekaLabQuiz';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<EurekaLabQuiz />} />
      </Routes>
    </>
  );
}
