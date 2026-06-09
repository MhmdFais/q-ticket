import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  getTicketByIdThunk,
  clearCurrentTicket,
} from "../features/tickets/ticketSlice";
import { getAllUsersThunk } from "../features/users/userSlice";
import Layout from "../components/layout/Layout";
import Spinner from "../components/common/Spinner";
import EditTicketForm from "../components/tickets/EditTicketForm";

const EditTicket = () => {
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
    return () => {
      dispatch(clearCurrentTicket());
    };
  }, [dispatch, id, user]);

  return (
    <Layout title="Edit Ticket">
      <div className="max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Ticket
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-800">Edit Ticket</h2>
            {currentTicket && (
              <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                {currentTicket.ticketNumber}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Fields marked with <span className="text-red-400">*</span> are
            required
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {loading && !currentTicket ? (
            <Spinner />
          ) : !currentTicket ? (
            <div className="text-center py-8 text-gray-400">
              Ticket not found
            </div>
          ) : (
            <EditTicketForm
              key={currentTicket._id}
              ticket={currentTicket}
              users={users}
              id={id}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EditTicket;
