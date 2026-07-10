function InputField({
    label,
    value,
    onChange,
    placeholder
}){

return(

<div className="mb-5">

<label className="block mb-2 font-semibold">

{label}

</label>

<input

className="w-full border rounded-lg p-3"

value={value}

placeholder={placeholder}

onChange={onChange}

/>

</div>

);

}

export default InputField;