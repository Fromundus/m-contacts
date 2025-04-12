import { useEffect, useState } from 'react'
import { IoMdArrowBack } from 'react-icons/io'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MdDelete, MdModeEdit } from "react-icons/md";
import { FaUser } from 'react-icons/fa';
import { db, Person, PhoneNumber } from '../db';
import EditContactFields from '../components/EditContactFields';
import Modal from '../components/Modal';

const Contact = () => {
    const { id } = useParams();
  const [modal, setModal] = useState<boolean>(false);
  const navigate = useNavigate();

    const [contact, setContact] = useState<null | (Person & { numbers: PhoneNumber[] })>(null);
    const [rerenderer, setRerenderer] = useState<boolean>(false);

    const getContactById = async (id: number): Promise<(Person & { numbers: PhoneNumber[] }) | null> => {
        const person = await db.people.get(id);
        if (!person) return null;
        
        const numbers = await db.numbers.where('user_id').equals(id).toArray();
        return { ...person, numbers };
    };

  useEffect(() => {
    const fetchContact = async () => {
      const data = await getContactById(Number(id));
      setContact(data);
    };
    fetchContact();
  }, [id, rerenderer]);

  console.log(contact);

  const openModal = () => {
    setModal(true);
  }

  const closeModal = () => {
    setModal(false);
  }

  const deleteContact = async (id: number) => {
    try {
      await db.transaction('rw', db.people, db.numbers, async () => {
        await db.numbers.where('id').equals(id).delete(); // Delete numbers
        await db.people.delete(id); // Delete person
      });
      alert("Contact deleted!");
      navigate('/');
      setRerenderer(prev => !prev);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Error deleting contact.");
    }
  };
    
  return (
    <div>
        <div className='flex items-center fixed left-0 right-0 top-0 bg-neutral-800 p-4'>
            <Link to={'/'} className="absolute text-2xl left-4 cursor-pointer"><IoMdArrowBack /></Link>
            <button className='ms-auto text-2xl' onClick={openModal}><MdModeEdit /></button>
        </div>

        <div className='flex w-full mt-16 justify-center flex-col items-center gap-4 text-center'>
            <div className="bg-neutral-800 p-8 rounded-full">
                <FaUser className="text-8xl" />
            </div>
            <span className='text-2xl'>{contact?.name}</span>
        </div>

        {contact?.numbers?.length ? <div className='w-full flex flex-col gap-4 items-center justify-center mt-4 bg-neutral-800 p-4 rounded-lg'>
            <div className='self-start'>
              <span>Contact Info</span>
            </div>
            {contact?.numbers.map((item) => {
                return (
                    <div className='flex items-center w-full' key={item.id}>
                        <span className='flex items-center gap-2'>
                            {item.number} <span className='text-xs'>({item.label})</span>
                        </span>
                        <a className='ms-auto' href={`sms:${item.number}?body=Hey ${contact.name}, just checking in!`}>Load</a>
                    </div>
                )
            })}
        </div>
        : null}

        <button className='flex items-center w-full h-11 border border-pink-900 bg-pink-950 text-white rounded-lg p-2 justify-center mt-4 gap-2' onClick={() => deleteContact(Number(id))}>Delete<MdDelete className='text-2xl' /></button>

        {modal && <Modal title="Update Contact" onClose={closeModal}>
          <div className="">
            <EditContactFields contact={contact} setRerenderer={setRerenderer} />
          </div>
        </Modal>}
    </div>
  )
}

export default Contact
