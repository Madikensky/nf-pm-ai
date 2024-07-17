import LoginRightHeading from './LoginRightHeading';
import LoginRightSubHeading from './LoginRightSubHeading';

export default function LoginRight() {
  return (
    <div className="login-right flex sm:w-1/2 w-full bg-gray-bg p-20 flex-col gap-10 mt-10">
      <div className="flex flex-col gap-5">
        <LoginRightHeading
          title="Какова цель использования этих двух токенов?"
          subtitle="Чтобы  наш ИИ имел доступ к вашим доскам и карточкам Trello,
          а также мог создавать элементы, ему нужны Trello API Token и Auth Token."
        />
        <LoginRightHeading
          title="Какие шаги необходимы для их получения?"
          subtitle="Следуйте инструкциям ниже для того чтобы получить необходимые Trello API токены:"
        />
      </div>
      <div className="flex flex-col gap-10 sm:gap-5">
        <LoginRightSubHeading
          title="Шаг 1: Войдите в Trello"
          subtitle={[
            {
              content: 'Перейдите на сайт ',
            },
            {
              content: 'Trello',
              weight: '600',
            },
            {
              content: 'и войдите в свою учетную запись.',
            },
          ]}
        />
        <LoginRightSubHeading
          title="Шаг 2: Сгенерируйте API ключ"
          subtitle={[
            { content: 'Перейдите на сайт ' },
            {
              content: 'link ',
              weight: '600',
            },
            { content: 'и нажмите в правой стороне на кнопку ' },
            { content: 'New ', weight: '600' },
            { content: 'или ' },
            { content: 'Новое. ', weight: '600' },
          ]}
        />
        <LoginRightSubHeading
          title="Шаг 3: Заполните небольшую форму "
          subtitle={[
            {
              content:
                'Заполните поля почты и название вашего проекта и нажмите ',
            },
            { content: 'Создать ', weight: '600' },
            { content: 'или ' },
            { content: 'Create.', weight: '600' },
          ]}
        />
        <LoginRightSubHeading
          title="Шаг 4: Сгенерируйте Trello API Token"
          subtitle={[
            { content: 'Сгенерируйте ключ нажатием на кнопку ' },
            { content: '“Сгенерировать новый API ключ”, ', weight: '600' },
            { content: 'затем вставьте этот ключ в поле ' },
            { content: 'Trello API Token. ', weight: '600' },
            { content: '<br>' },
            { content: '<br>' },
            { content: 'Пример ключа: ' },
            {
              content: 'e1d25531ea4bc8e775d413013...',
              color: '',
              weight: '600',
            },
          ]}
        />
        <LoginRightSubHeading
          title="Шаг 5: Сгенерируйте Trello Auth Token  "
          subtitle={[
            {
              content:
                'Справа от поля с вашим API ключом будет небольшой текст, нажмите там на cинее слово ',
            },
            {
              content: 'token ',
              weight: '600',
            },
            {
              content: 'или ',
            },
            {
              content: 'токен ',
              weight: '600',
            },
            {
              content: 'и сгенерируйте ваш ',
            },
            {
              content: 'Trello Auth Token ',
              weight: '600',
            },
            {
              content: 'и вставьте его во второе поле. ',
            },
            { content: '<br>' },
            { content: '<br>' },
            { content: 'Пример ключа: ' },
            {
              content: 'ATTA2d0b2b6ac542e52901bdab1e3a132caaba6700A3...',
              weight: '600',
            },
          ]}
        />
      </div>
    </div>
  );
}
