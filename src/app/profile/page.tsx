import UpdateButton from "@/components/UpdateButton";
import { updateUser } from "@/lib/actions";
import { wixClientServer } from "@/lib/wixClientServer";
import { members } from "@wix/members";
import Link from "next/link";
import { format } from "timeago.js";

const ProfilePage = async () => {
  try {
    const wixClient = await wixClientServer();

    const user = await wixClient.members.getCurrentMember({
      fieldsets: [members.Set.FULL],
    });

    if (!user.member?.contactId) {
      return <div className="">Not logged in!</div>;
    }

    const orderRes = await wixClient.orders.searchOrders({
      search: {
        filter: { "buyerInfo.contactId": { $eq: user.member?.contactId } },
      },
    });

    return (
      <div className="flex flex-col md:flex-row gap-24 md:h-[calc(100vh-180px)] items-center px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl">Profile</h1>
          <form action={updateUser} className="mt-12 flex flex-col gap-4">
            <input type="text" hidden name="id" value={user.member.contactId} />
            <label className="text-sm text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              placeholder={user.member?.profile?.nickname || "john"}
              className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
            />
            {/* Other input fields */}
            <UpdateButton />
          </form>
        </div>
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl">Orders</h1>
          <div className="mt-12 flex flex-col">
            {orderRes.orders.map((order) => (
              <Link
                href={`/orders/${order._id}`}
                key={order._id}
                className="flex justify-between px-2 py-6 rounded-md hover:bg-green-50 even:bg-slate-100"
              >
                {/* Display order details */}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching profile data:", error);
    // Handle error state, display a message, or redirect to an error page
    return <div>Error fetching profile data. Please try again later.</div>;
  }
};

export default ProfilePage;
