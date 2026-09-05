import { FaBuilding } from "react-icons/fa";

function InputField({
  label,
  value,
  onChange,
  placeholder,
  icon,
}) {
  return (
    <div className="mb-6">

      <label className="block text-slate-300 font-medium mb-3">
        {label}
      </label>

      <div className="flex items-center bg-slate-800 border border-slate-700 rounded-2xl px-4 focus-within:border-cyan-400 transition">

        <div className="text-slate-400 text-lg">
          {icon || <FaBuilding />}
        </div>

        <input
          className="w-full bg-transparent text-white placeholder-slate-500 py-3 px-3 outline-none"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />

      </div>

    </div>
  );
}

export default InputField;