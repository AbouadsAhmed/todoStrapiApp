import { ChangeEvent, useState } from "react";
import useAuthQuery from "../../hooks/useAuthQuery";

import TodoSkleton from "../TodoSkleton";
import Button from "../ui/Button";
import Paginator from "../ui/Pagnator";

const TodoPage = () => {
  const storageKay = "loggedInUser";
  const userDataString = localStorage.getItem(storageKay);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("ASC");

  const onclickPrev = () => {
    setPage((prev) => prev - 1);
  };
  const onclickNext = () => {
    setPage((next) => next + 1);
  };
  const onchangePageSize = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(+e.target.value);
  };
  const onSortBy = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };
  const { data, isLoading, isFetching } = useAuthQuery({
    queryKey: [`todos-page-${page}`, `${pageSize}`, `${sortBy}`],
    url: `/todos?pagination[pageSize]=${pageSize}&pagination[page]=${page}&sort=createdAt:${sortBy}`,
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
  return (
    <section className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between space-x-2">
        <Button size={"sm"}>Generate</Button>
        <div className="flex items-center justify-center space-x-3">
          <select
            className="border-2 border-indigo-600 p-2 rounded-md"
            value={sortBy}
            onChange={onSortBy}
          >
            <option disabled>sortBy</option>
            <option value="ASC">Oldest</option>
            <option value="DESC">New</option>
          </select>
          <select
            className="border-2 border-indigo-600 p-2 rounded-md"
            value={pageSize}
            onChange={onchangePageSize}
          >
            <option disabled>Page size</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      <div className="my-20 space-y-6">
        {data.data.length ? (
          data.data.map(
            ({
              id,
              attributes,
            }: {
              id: number;
              attributes: { title: string };
            }) => (
              <div
                key={id}
                className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
              >
                <h3 className="w-full font-semibold">
                  {id} - {attributes.title}
                </h3>
              </div>
            )
          )
        ) : (
          <h3>No todos yet!</h3>
        )}
        <Paginator
          page={page}
          pageCount={data.meta.pagination.pageCount}
          total={data.meta.pagination.total}
          onclickNext={onclickNext}
          onclickPrev={onclickPrev}
          isLoading={isLoading || isFetching}
        />
      </div>
    </section>
  );
};

export default TodoPage;
