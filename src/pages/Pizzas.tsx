import React from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/store";
import Categories from "../components/Categories";
import Sort from "../components/Sort";
import PizzaBlock from "../components/PizzaBlock";
import Skeleton from "../components/PizzaBlock/Skeleton";
import Pagination from "../components/Pagination";
import { setCategoryId, setCurrentPage } from "../redux/filter/slice";
import { filterSelector } from "../redux/filter/selectors";
import { fetchPizzas } from "../redux/pizzas/slice";
import { pizzaDataSelector } from "../redux/pizzas/selectors";
import { Status } from "../redux/pizzas/types";

const Pizzas: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, status } = useSelector(pizzaDataSelector);
  const { categoryId, sortProp, currentPage, searchValue } = useSelector(filterSelector);

  React.useEffect(() => {
    dispatch(
      fetchPizzas({
        categoryId: categoryId > 0 ? `category=${categoryId}` : '',
        sortProp: sortProp.sort.replace('-', ''),
        order: sortProp.sort[0] === '-' ? 'desc' : 'asc',
        search: searchValue ? `&search=${searchValue}` : '',
        currentPage,
      })
    );
  }, [dispatch, categoryId, sortProp, searchValue, currentPage]);

  const onChangeCategory = React.useCallback((id: number) => {
    dispatch(setCategoryId(id));
  }, [dispatch]);

  const onChangePage = (num: number) => {
    dispatch(setCurrentPage(num));
  };

  const skeletons = [...new Array(4)].map((_, index) => <Skeleton key={index} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories categoryId={categoryId} onChangeCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">All pizzas</h2>
      {status === Status.ERROR ? (
        <div style={{ textAlign: 'center', width: '100%' }}>Failed to load pizzas. Please try again later.</div>
      ) : (
        <div className="content__items">
          {status === Status.LOADING ? skeletons : items.map((pizza) => <PizzaBlock key={pizza.id} {...pizza} />)}
        </div>
      )}
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Pizzas; 