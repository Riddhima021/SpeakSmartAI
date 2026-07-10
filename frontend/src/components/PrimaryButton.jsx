function PrimaryButton({

title,

onClick,

loading

}){

return(

<button

onClick={onClick}

disabled={loading}

className="w-full bg-blue-600 text-white py-3 rounded-lg"

>

{

loading

?

"Generating..."

:

title

}

</button>

);

}

export default PrimaryButton;