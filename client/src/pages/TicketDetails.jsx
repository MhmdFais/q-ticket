import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getTicketByIdThunk } from "../features/tickets/ticketSlice";
import { getAllUsersThunk } from "../features/users/userSlice";
import Layout from "../components/layout/Layout";
import Spinner from "../components/common/Spinner";
import TicketDetailsContent from "../components/tickets/TicketDetailsContent";

const TicketDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTicket, loading } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getTicketByIdThunk(id));
    if (user?.role === "admin") {
      dispatch(getAllUsersThunk({ role: "agent", limit: 100 }));
    }
  }, [dispatch, id, user]);

  return (
    <Layout title="Ticket Details">
      <div className="w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </button>

        {loading && !currentTicket ? (
          <Spinner />
        ) : !currentTicket ? (
          <div className="text-center py-12 text-gray-400">
            Ticket not found
          </div>
        ) : (
          <TicketDetailsContent ticket={currentTicket} users={users} />
        )}
      </div>
    </Layout>
  );
};

export default TicketDetails;
