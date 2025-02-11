import FavButton from "./FavButton";

interface HomeProps {
   tipo: string;
   favorited: boolean;
}

export default function CardImovel({ tipo, favorited }: HomeProps) {
   return (
      <div className="w-[70%] h-[497px] max-w-[350px] bg-[#EDEDED] rounded-2xl shadow-[4px_4px_4px_rgba(0,0,0,0.2)]">
         <div>
            <img
               src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
               alt="a"
               className="w-[100%]  max-h-[40%] max-w-[350px] rounded-t-2xl"
            />
         </div>
         <div className="ml-6 mt-4">
            <div>
               <h3 className="text-havprincipal text-fontcard1">{tipo}</h3>
            </div>
            <div>
               <FavButton favorited={favorited} />
            </div>
         </div>
      </div>
   );
}
