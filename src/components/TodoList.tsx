import Button from "./ui/Button";
import { ItoDo } from "../interfaces";
import useAuthQuery from "../hooks/useAuthQuery";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import { ChangeEvent, FormEvent, useState } from "react";
import Textarea from "./ui/Textarea";
import AxiosInstance from "../config/Config";
import TodoSkleton from "./TodoSkleton";
const TodoList = () => {
  const storageKay = "loggedInUser";
  const userDataString = localStorage.getItem(storageKay);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [queryVersion, setIsQueryVersion] = useState(1);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [todoAdd, setIsTodoAdd] = useState({
    title: "",
    description: "",
  });
  const [todoEdit, setIsTodoEdit] = useState<ItoDo>({
    id: 0,
    title: "",
    description: "",
  });
  // handle modal
  //Add
  const onCloseAddModal = () => {
    setIsTodoAdd({
      title: "",
      description: "",
    });
    setIsAddOpen(false);
  };
  const onOpenAddModal = () => {
    setIsAddOpen(true);
  };
  const submitAddHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const { title, description } = todoAdd;
      const { status } = await AxiosInstance.post(
        `/todos`,
        { data: { title, description } },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      console.log(status);
      if (status === 200) {
        onCloseAddModal();
        setIsQueryVersion((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
    console.log(todoAdd);
  };
  // changing
  const onchangeAddHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setIsTodoAdd({
      ...todoAdd,
      [name]: value,
    });
  };
  //Edit
  const onCloseModal = () => {
    setIsTodoEdit({
      id: 0,
      title: "",
      description: "",
    });
    setIsEditOpen(false);
  };
  const onOpenModal = (todo: ItoDo) => {
    setIsTodoEdit(todo);
    setIsEditOpen(true);
  };
  // changing Edit
  const onchangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setIsTodoEdit({
      ...todoEdit,
      [name]: value,
    });
  };
  // caching
  const { data, isLoading } = useAuthQuery({
    queryKey: ["todoList", `${queryVersion}`],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });
  console.log(data, isLoading);
  if (isLoading) {
    return (
      <div className="space-y-2 p-3">
        {Array.from({ length: 3 }, (_, idx) => (
          <TodoSkleton key={idx} />
        ))}
      </div>
    );
  }
  // submit Edit handling
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const { title, description } = todoEdit;
      const { status } = await AxiosInstance.put(
        `/todos/${todoEdit.id}`,
        { data: { title, description } },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      console.log(status);
      if (status === 200) {
        onCloseModal();
        setIsQueryVersion((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
    console.log(todoEdit);
  };
  //remove todo

  const openConfirmModal = (todo: ItoDo) => {
    setIsTodoEdit(todo);
    setIsOpenConfirmModal(true);
  };
  const onCloseDeleteTodoModal = () => {
    setIsTodoEdit({
      id: 0,
      title: "",
      description: "",
    });
    setIsOpenConfirmModal(false);
  };
  const onRemove = async () => {
    try {
      const { status } = await AxiosInstance.delete(`/todos/${todoEdit.id}`, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      });
      if (status === 200) {
        onCloseDeleteTodoModal();
        setIsQueryVersion((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="space-y-1 ">
      <div className="mx-auto w-fit my-10">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-32 h-9 bg-gray-300 rounded-md dark:bg-gray-400"></div>
            <div className="w-32 h-9 bg-gray-300 rounded-md dark:bg-gray-400"></div>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Button size={"sm"} onClick={onOpenAddModal}>
              Post New Todo
            </Button>
            <Button size={"sm"} variant={"outline"}>
              Generate todos
            </Button>
          </div>
        )}
      </div>
      {data.todos.length ? (
        data.todos.map((todo: ItoDo, idx: number) => (
          <div
            key={todo.id}
            className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
          >
            <p className="w-full font-semibold">
              {idx + 1} - {todo.title}
            </p>
            <div className="flex items-center justify-end w-full space-x-3">
              <Button size={"sm"} onClick={() => onOpenModal(todo)}>
                Edit
              </Button>
              <Button
                variant={"danger"}
                size={"sm"}
                onClick={() => openConfirmModal(todo)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h3>No todos yet!</h3>
      )}

      {/* Add modal */}
      <Modal closeModal={onCloseAddModal} isOpen={isAddOpen}>
        <form className="space-y-3" onSubmit={submitAddHandler}>
          <Input
            value={todoAdd.title}
            name="title"
            onChange={onchangeAddHandler}
          />
          <Textarea
            value={todoAdd.description}
            name="description"
            onChange={onchangeAddHandler}
          />
          <div className="flex items-center space-x-2 mt-4">
            <Button
              className="bg-indigo-700 hover:bg-indigo-800"
              isLoading={isUpdating}
            >
              Add
            </Button>
            <Button variant={"cancel"} onClick={onCloseModal} type="button">
              Cancle
            </Button>
          </div>
        </form>
      </Modal>
      {/* Edit modal */}
      <Modal closeModal={onCloseModal} isOpen={isEditOpen}>
        <form className="space-y-3" onSubmit={submitHandler}>
          <Input
            value={todoEdit.title}
            name="title"
            onChange={onchangeHandler}
          />
          <Textarea
            value={todoEdit.description}
            name="description"
            onChange={onchangeHandler}
          />
          <div className="flex items-center space-x-2 mt-4">
            <Button
              className="bg-indigo-700 hover:bg-indigo-800"
              isLoading={isUpdating}
            >
              Update
            </Button>
            <Button variant={"cancel"} onClick={onCloseModal} type="button">
              Cancle
            </Button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={isOpenConfirmModal}
        closeModal={onCloseDeleteTodoModal} //  ده الزرار اللى اللى جوه المودل اللى بيقفلها اللى هو تحت منى بسطرين تلاته واللى اسمه  cancel
        //  ولو سألت نفسك لى ال  closeModle  بتاخد  closeConfirmModal  مش بتاخد ال  isOpenConfirmModal  هقولك عشان المودل مفيهاش
        // غير زرار للقفل فقط ومفيش للفتح طبعا ولو طلعت فوق فى الكود هتلاقى فانكشن زى دى بتفتح المودل
        // وعلى فكره المودل مش بيفتح ولا بيقفل غير بناء على ال  isOpenConfirmModale  ولكن احنا بنبعت الفانكشن  closeConfi.....
        //  لانها برضه بتدى false  لل  isOpenConfir....
        title="Are you sure you want to remove this Product from your Store?"
        description="Deleting this product will remove it permanently from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
      >
        <div className="flex items-center space-x-3">
          <Button className="bg-[#c2344d] hover:bg-red-800" onClick={onRemove}>
            Yes, remove
          </Button>
          <Button
            className="bg-[#f5f5fa] hover:bg-gray-300 !text-black"
            onClick={onCloseDeleteTodoModal}
            type="button"
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};
export default TodoList;
