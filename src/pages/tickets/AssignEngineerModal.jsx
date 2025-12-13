import { useForm } from "react-hook-form";
import { X } from "lucide-react";

export default function AssignEngineerModal({ ticket, engineers, onAssign, onClose }) {
  const { register, handleSubmit } = useForm();

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit(onAssign)}
        className="bg-white w-96 rounded-xl p-6 space-y-4"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Assign Engineer</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        <select
          {...register("engineerId")}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Engineer</option>
          {engineers.map((e) => (
            <option key={e._id} value={e._id}>
              {e.name}
            </option>
          ))}
        </select>

        <button className="w-full bg-emerald-600 text-white py-2 rounded">
          Assign
        </button>
      </form>
    </div>
  );
}
