import InputField from './InputField';

export default function LoginLeft() {
  return (
    <form className="login-left flex w-1/2 border-2 border-red-600">
      <div className="flex flex-col gap-10  border-blue-600 items-center p-10">
        <p className="text-main-color text-default font-semibold">Вход</p>
        <p className="text-gray-color font-semibold text-smaller text-center">
          Введите свой Trello API Token и Trello Auth Token для входа в свою
          учетную запись
        </p>
        <InputField tokenType="Trello API Token" />
        <InputField tokenType="Trello Auth Token" />
        <button className="text-white font-semibold text-smaller bg-main-color p-2 rounded-md w-1/4">
          Войти
        </button>
      </div>
    </form>
  );
}
