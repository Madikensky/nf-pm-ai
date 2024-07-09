import Header from '../components/Header';
import LoginLeft from '../components/LoginLeft';
import LoginRight from '../components/LoginRight';

export default function Login() {
  return (
    <>
      <Header showLogin={false} />
      <div className="flex flex-row">
        <LoginLeft />
        <LoginRight />
      </div>
    </>
  );
}
