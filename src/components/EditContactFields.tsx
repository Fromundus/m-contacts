import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { MdDelete } from "react-icons/md";
import { db } from "../db"; // Update this path if needed
import type { Person, PhoneNumber } from "../db";
import { useEffect } from "react";

const contactSchema = z.object({
  name: z.string().min(2, "Name is too short."),
  address: z.string().nonempty("Please enter the address."),
  numbers: z.array(z.object({
    label: z.string().nonempty("Please enter the label."),
    number: z.string().min(11, "Number must be 11 digits.").max(11, "Number must be 11 digits").regex(/^\d+$/, "Only digits allowed"),
  })),
});

type ContactSchema = z.infer<typeof contactSchema>;

interface Props {
  contact: null | (Person & { numbers: PhoneNumber[] });
  setRerenderer: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditContactFields = ({ contact, setRerenderer }: Props) => {
  // const { data, setData } = useStateContext();
  const editingId = contact?.id;

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      numbers: [],
    },
  });

  useEffect(() => {
    if(contact){
      setValue('name', contact?.name);
      setValue('address', contact?.address);
    }
  }, [contact]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "numbers",
  });

  const onSubmit = async (data: ContactSchema) => {
    try {
      if (editingId !== null && editingId !== undefined) {
        // 🛠️ Edit Mode: Update existing person
        await db.people.update(editingId, {
          name: data.name,
          address: data.address,
        });
  
        // Remove old numbers for this person

        // await db.numbers.where("user_id").equals(editingId).delete();
  
        // Add new numbers
        const updatedNumbers: Omit<PhoneNumber, "id">[] = data.numbers.map((item) => ({
          user_id: editingId,
          label: item.label,
          number: item.number,
        }));
  
        await db.numbers.bulkAdd(updatedNumbers);
  
        alert("Contact updated!");
      } else {
        // ➕ Add Mode: Create new person
        const newPerson: Omit<Person, "id"> = {
          name: data.name,
          address: data.address,
        };
  
        const personId = await db.people.add(newPerson);
  
        const phoneNumbers: Omit<PhoneNumber, "id">[] = data.numbers.map((item) => ({
          user_id: personId,
          label: item.label,
          number: item.number,
        }));
  
        await db.numbers.bulkAdd(phoneNumbers);
  
        alert("Contact added!");
      }
  
      reset();
      setRerenderer(prev => !prev);
    } catch (err) {
      console.error("Failed to save contact:", err);
      alert("Error saving contact.");
    }
  };
  

  const deleteContact = async (id: number) => {
    try {
      await db.transaction('rw', db.people, db.numbers, async () => {
        await db.numbers.where('id').equals(id).delete(); // Delete numbers
        // await db.people.delete(id); // Delete person
      });
      alert("Contact deleted!");
      // loadContacts(); // Refresh UI
      setRerenderer(prev => !prev);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Error deleting contact.");
    }
  };

  return (
    <div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <input
            className="border rounded-lg h-11 w-full px-4"
            type="text"
            {...register("name")}
            placeholder="Name"
          />
          {errors.name && <span className="text-red-500">{errors.name.message}</span>}
        </div>

        <div className="flex flex-col">
          <input
            className="border rounded-lg h-11 w-full px-4"
            type="text"
            {...register("address")}
            placeholder="Address"
          />
          {errors.address && <span className="text-red-500">{errors.address.message}</span>}
        </div>

        {contact?.numbers.map((item) => {
          return (
            <div className="flex gap-2" key={item.id}>
              <div className="flex gap-2 w-full"> 
                <div className="flex flex-col w-1/2"> 
                  <input
                    className="border rounded-lg h-11 w-full px-4"
                    type="number"
                    // {...register(`numbers.${index}.number`)}
                    value={item.number}
                    placeholder="Number"
                    readOnly
                  />
                  {/* {errors.numbers?.[index]?.number && <span className="text-red-500">{errors.numbers?.[index]?.number.message}</span>} */}
                </div>

                <div className="flex flex-col w-1/2">
                  <input
                    className="border rounded-lg h-11 w-full px-4"
                    type="text"
                    // {...register(`numbers.${index}.label`)}
                    value={item.label}
                    placeholder="Number Label"
                    readOnly
                  />
                  {/* {errors.numbers?.[index]?.label && <span className="text-red-500">{errors.numbers?.[index]?.label.message}</span>} */}
                </div>
              </div>
              <button type="button" className="text-2xl rounded-lg h-fit p-2 border border-pink-900 bg-pink-950 text-white" onClick={() => deleteContact(Number(item.id))}><MdDelete /></button>
            </div>

          )
        })}

        {fields.map((item, index) => {
          return (
            <div className="flex gap-2" key={item.id}>
              <div className="flex gap-2 w-full"> 
                <div className="flex flex-col w-1/2"> 
                  <input
                    className="border rounded-lg h-11 w-full px-4"
                    type="number"
                    {...register(`numbers.${index}.number`)}
                    placeholder="Number"
                  />
                  {errors.numbers?.[index]?.number && <span className="text-red-500">{errors.numbers?.[index]?.number.message}</span>}
                </div>

                <div className="flex flex-col w-1/2">
                  <input
                    className="border rounded-lg h-11 w-full px-4"
                    type="text"
                    {...register(`numbers.${index}.label`)}
                    placeholder="Number Label"
                  />
                  {errors.numbers?.[index]?.label && <span className="text-red-500">{errors.numbers?.[index]?.label.message}</span>}
                </div>
              </div>
              {contact?.numbers.length !== 0 && <button type="button" className="text-2xl rounded-lg h-fit p-2 border border-pink-900 bg-pink-950 text-white" onClick={() => remove(index)}><MdDelete /></button>}
            </div>
          )
        })}

        <button type="button" className="h-11 border border-pink-900 bg-pink-950 text-white rounded-lg font-semibold w-fit p-2" onClick={() => append({ label: "", number: ""})}>+ Add Number</button>

        <button className="h-11 border border-pink-900 bg-pink-950 text-white rounded-lg font-semibold mt-4">Save</button>
      </form>
    </div>
  )
}

export default EditContactFields