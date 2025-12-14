import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ClipLoader } from "react-spinners";
import { createTicket } from "../../api/tickets";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  deviceType: yup.string().required("Device type is required"),
  issueDescription: yup.string().required("Issue description is required"),
});

export default function CreateTicket() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await createTicket(data);
      navigate("/my-tickets");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-emerald-700 mb-6">
        Create Service Ticket
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Device */}
        <div>
          <label className="block text-sm font-medium">Device Type</label>
          <input
            {...register("deviceType")}
            className="w-full border rounded px-3 py-2 mt-1"
            placeholder="Laptop / AC / TV"
          />
          <p className="text-red-500 text-xs">{errors.deviceType?.message}</p>
        </div>

        {/* Issue */}
        <div>
          <label className="block text-sm font-medium">
            Issue Description
          </label>
          <textarea
            {...register("issueDescription")}
            rows="4"
            className="w-full border rounded px-3 py-2 mt-1"
            placeholder="Describe the issue..."
          />
          <p className="text-red-500 text-xs">
            {errors.issueDescription?.message}
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded flex justify-center"
        >
          {loading ? <ClipLoader color="#fff" size={22} /> : "Create Ticket"}
        </button>
      </form>
    </div>
  );
}
