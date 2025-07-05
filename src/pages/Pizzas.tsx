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
import styles from "./Pizzas.module.scss";

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

  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

  const renderContent = () => {
    if (status === Status.ERROR) {
      return null;
    }

    if (status === Status.LOADING) {
      return (
        <div className={styles.loading}>
          {skeletons}
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className={styles.error}>
          No pizzas found. Try adjusting your search or filters.
        </div>
      );
    }

    return (
      <div className={styles.content__items}>
        {items.map((pizza) => (
          <PizzaBlock key={pizza.id} {...pizza} />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.content__top}>
        <Categories categoryId={categoryId} onChangeCategory={onChangeCategory} />
        <Sort />
      </div>
      
      <h2 className={styles.content__title}>
        {searchValue ? `Search results for "${searchValue}"` : "All pizzas"}
      </h2>

      {/* Show Coming Soon for Jain category */}
      {categoryId === 5 && (
        <div className={styles.comingSoon}>
          <span role="img" aria-label="pizza" style={{fontSize: 28, marginRight: 8}}>🍕</span>
          <span style={{fontSize: 20, color: '#fe5f1e', fontWeight: 600}}>Coming Soon</span>
        </div>
      )}
      
      {renderContent()}
      
      {status !== Status.ERROR && items.length > 0 && (
        <div className={styles.pagination}>
          <Pagination currentPage={currentPage} onChangePage={onChangePage} />
        </div>
      )}
    </div>
  );
};

export default Pizzas; 