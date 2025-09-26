import LoadEvents from "../layouts/LoadEvents"
import AvatarMenu from "../components/miniComponents/AvatarMenu";

export default function Events() {
  

  return(
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="">Events</h1>
        <AvatarMenu />
      </div>
      <LoadEvents />
    </div>
  );
}
