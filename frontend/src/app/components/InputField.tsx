interface InputFieldProps {
  tokenType: string;
}

export default function InputField({ tokenType }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <label
        htmlFor={tokenType}
        className="text-smaller text-main-color font-semibold w-1/2"
      >
        {tokenType}
      </label>
      <input
        type="text"
        placeholder={`Ваш ${tokenType}`}
        id={tokenType}
        className="border-2 text-smaller p-5 rounded-lg outline-none border-main-color w-1/2"
      />
    </div>
  );
}
