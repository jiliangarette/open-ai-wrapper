import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar";

const HomePage = () => {
  return (
    <div className="flex flex-col place-items-center justify-center w-screen h-screen">
      <h1 className="text-slate-500 bg-slate-200 px-8 py-4 w-fit flex gap-2 place-items-center justify-center rounded-md">
        <Avatar>
          <AvatarImage
            src="https://github.com/jiliangarette.png"
            alt="@jilian"
          />
          <AvatarFallback>JG</AvatarFallback>
        </Avatar>
        Hello world!
      </h1>
    </div>
  );
};
export default HomePage;
