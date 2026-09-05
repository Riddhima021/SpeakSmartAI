import { FaChevronDown } from "react-icons/fa";

function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div className="mb-6">
      <label className="block text-slate-300 font-medium mb-3">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-5 text-white outline-none focus:border-cyan-400 transition appearance-none"
        >
          <option value="" className="bg-slate-800">
            Select
          </option>

          {options.map((item) => (
            <option
              key={item}
              value={item}
              className="bg-slate-800"
            >
              {item}
            </option>
          ))}
        </select>

        <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

export default SelectField;