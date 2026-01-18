import { useDispatch, useSelector } from "react-redux";
import EditProfile from "./EditProfile";
import UserCard from "./UserCard";

const Profile = () => {
  const user = useSelector((state) => state.user);

  return <div>{user && <EditProfile user={user} />}</div>;
};

export default Profile;
