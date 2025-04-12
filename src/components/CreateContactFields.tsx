import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { MdDelete } from "react-icons/md";
import { db } from "../db"; // Update this path if needed
import type { Person, PhoneNumber } from "../db";

const contactSchema = z.object({
  name: z.string().min(2, "Name is too short."),
  address: z.string().nonempty("Please enter the address."),
  numbers: z.array(z.object({
    label: z.string().nonempty("Please enter the label."),
    number: z.string().min(11, "Number must be 11 digits.").max(11, "Number must be 11 digits").regex(/^\d+$/, "Only digits allowed"),
  })).min(1, "At least one contact number is required"),

});

type ContactSchema = z.infer<typeof contactSchema>;

interface Props {
  onSave: () => void;
}

const CreateContactFields = ({ onSave }: Props) => {
  // const { data, setData } = useStateContext();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      numbers: [{ label: "", number: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "numbers",
  });

  // const onSubmit = (data: ContactSchema) => {
  //   console.log(data);
  //   setData((prev) => {
  //     if(prev?.length === 0){
  //       const updatedNumbers = data.numbers.map((item, index) => {
  //         return {
  //           id: Date.now() + Date.now() + index,
  //           user_id: Date.now(),
  //           label: item.label,
  //           number: item.number,
  //         }
  //       });

  //       const updatedContacts = [
  //         {
  //           id: Date.now(),
  //           name: data.name,
  //           address: data.address,
  //           numbers: [
  //             ...updatedNumbers
  //           ]
  //         },
  //       ]

  //       return updatedContacts;
  //     } else {

  //       const updatedNumbers = data.numbers.map((item, index) => {
  //         return {
  //           id: Date.now() + Date.now() + index,
  //           user_id: Date.now(),
  //           label: item.label,
  //           number: item.number,
  //         }
  //       });

  //       const updatedContacts = [
  //         ...prev,
  //         {
  //           id: Date.now(),
  //           name: data.name,
  //           address: data.address,
  //           numbers: [
  //             ...updatedNumbers
  //           ]
  //         },
  //       ]

  //       return updatedContacts;
  //     }
  //   });

  //   reset();
  // }

  const onSubmit = async (data: ContactSchema) => {
    const newPerson: Omit<Person, "id"> = {
      name: data.name,
      address: data.address,
    };
  
    try {
      // Add person and get the generated ID
      const personId = await db.people.add(newPerson);
  
      // Add phone numbers with correct foreign key
      const phoneNumbers: Omit<PhoneNumber, "id">[] = data.numbers.map((item) => ({
        user_id: personId,
        label: item.label,
        number: item.number,
      }));
  
      await db.numbers.bulkAdd(phoneNumbers);
  
      alert("Contact created!");
      reset(); // Clear the form
      onSave();
    } catch (err) {
      console.error("Failed to save contact:", err);
      alert("Error saving contact.");
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
              {index !== 0 && <button type="button" className="text-2xl rounded-lg h-fit p-2 border border-pink-900 bg-pink-950 text-white" onClick={() => remove(index)}><MdDelete /></button>}
            </div>

          )
        })}

        <button type="button" className="h-11 border border-pink-900 bg-pink-950 text-white rounded-lg font-semibold w-fit p-2" onClick={() => append({ label: "", number: ""})}>+ Add Number</button>

        <button className="h-11 border border-pink-900 bg-pink-950 text-white rounded-lg font-semibold mt-4">Submit</button>
      </form>
    </div>
  )
}

export default CreateContactFields