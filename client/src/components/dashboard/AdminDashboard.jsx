import StatCard from "../common/StatCard";
import SectionTitle from "../common/SectionTitle";
import TicketCard from "../common/TicketCard";

const AdminDashboard = ({ stats, user }) => {
  if (!stats?.tickets) return null;

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome back, {user?.name}
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Here's your system overview
        </p>
      </div>

      {/* Ticket Stats */}
      <div>
        <SectionTitle title="Overview" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Total" value={stats.tickets.total} color="indigo" />
          <StatCard label="Open" value={stats.tickets.open} color="indigo" />
          <StatCard
            label="In Progress"
            value={stats.tickets.inProgress}
            color="amber"
          />
          <StatCard
            label="Resolved"
            value={stats.tickets.resolved}
            color="emerald"
          />
          <StatCard label="Closed" value={stats.tickets.closed} color="gray" />
        </div>
      </div>

      {/* Attention */}
      <div>
        <SectionTitle title="Attention" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Urgent" value={stats.tickets.urgent} color="red" />
          <StatCard
            label="Unassigned"
            value={stats.tickets.unassigned}
            color="orange"
          />
        </div>
      </div>

      {/* Recent Tickets */}
      <div>
        <SectionTitle title="Recent Tickets" />
        {stats.recentTickets.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm bg-white rounded-xl border border-gray-200">
            No tickets yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.recentTickets.map((ticket) => (
              <TicketCard
                key={ticket._id}
                ticket={ticket}
                showCreatedBy={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
