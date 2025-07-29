import { useAuth } from "../../context/AuthContext";

const UserDashboard = () => {

    const { name } = useAuth();

    return <h1 className="text-2xl font-bold">Welcome, User : {name} !</h1>;
};

export default UserDashboard;
