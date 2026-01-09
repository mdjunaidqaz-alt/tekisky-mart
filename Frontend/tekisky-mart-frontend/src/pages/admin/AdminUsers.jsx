import { useEffect, useState } from "react";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const toggleBlock = async (userId) => {
    await axios.put(
      `http://localhost:5000/api/admin/users/${userId}/block`,
      {},
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );

    setUsers((prev) =>
      prev.map((user) =>
        user._id === userId
          ? { ...user, isBlocked: !user.isBlocked }
          : user
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeInUp">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Customers
      </h2>

      {/* TABLE WRAPPER */}
      <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Joined</th>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-gray-50 transition"
              >
                {/* NAME */}
                <td className="px-4 py-3 font-medium text-gray-800">
                  {user.name}
                </td>

                {/* EMAIL */}
                <td className="px-4 py-3 text-gray-600">
                  {user.email}
                </td>

                {/* ROLE */}
                <td className="px-4 py-3 capitalize">
                  {user.role}
                </td>

                {/* JOINED */}
                <td className="px-4 py-3">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                {/* ACTION */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleBlock(user._id)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium text-white transition ${
                      user.isBlocked
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>

                {/* STATUS */}
                <td className="px-4 py-3 font-medium">
                  {user.isBlocked ? (
                    <span className="text-red-600">
                      🚫 Blocked
                    </span>
                  ) : (
                    <span className="text-green-600">
                      ✅ Active
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
