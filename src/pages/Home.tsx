import { useEffect, useState } from "react"
import AddContactButton from "../components/AddContactButton"
import Page from "../components/Page"
import Modal from "../components/Modal";
import CreateContactFields from "../components/CreateContactFields";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { db, Person, PhoneNumber } from '../db';

type ContactWithNumbers = Person & { numbers: PhoneNumber[] };

const Home = () => {
  const [modal, setModal] = useState<boolean>(false);
  // const { data } = useStateContext();
  const [contacts, setContacts] = useState<ContactWithNumbers[]>([]);

  const loadContacts = async () => {
    const people = await db.people.toArray();
    const data = await Promise.all(
      people.map(async (person) => {
        const numbers = await db.numbers.where('user_id').equals(person.id!).toArray();
        return { ...person, numbers };
      })
    );
    setContacts(data);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const openModal = () => {
    setModal(true);
  }

  const closeModal = () => {
    setModal(false);
  }
  
  const renderData = contacts.map((item) => {
    return (
      <Link key={item.id} to={`/contact/${item.id}`} className="flex items-center gap-2 hover:bg-neutral-700 p-2 rounded">
        <div className="bg-neutral-800 p-2 rounded-full">
          <FaUser className="text-2xl" />
        </div>
        {item.name}
      </Link>
    )
  });

  return (
    <Page>
        <span>Contacts</span>
        <div className="flex flex-col mt-4">
          {renderData}
        </div>

        <div className="fixed bottom-[70px] right-2">
          <AddContactButton handleClick={openModal} />
        </div>

        {modal && <Modal title="Create Contact" onClose={closeModal}>
          <div className="">
            <CreateContactFields onSave={loadContacts} />
          </div>
        </Modal>}
    </Page>
  )
}

export default Home
