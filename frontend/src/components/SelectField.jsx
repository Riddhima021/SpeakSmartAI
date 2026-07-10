function SelectField({

label,

value,

onChange,

options

}){

return(

<div className="mb-5">

<label className="block mb-2 font-semibold">

{label}

</label>

<select

className="w-full border p-3 rounded-lg"

value={value}

onChange={onChange}

>

<option value="">

Select

</option>

{

options.map((item)=>(

<option

key={item}

value={item}

>

{item}

</option>

))

}

</select>

</div>

);

}

export default SelectField;